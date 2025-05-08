
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

export interface RelatedItem {
  id: string;
  content: string;
  relatedItemIds: string[];
}

export interface RelatedCustomerItem {
  id: string;
  content: string;
  priority?: 'low' | 'medium' | 'high';
  severity?: 'low' | 'medium' | 'high';
  importance?: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
}

interface RelatedItemListProps {
  title: string;
  description: string;
  bgColor: string;
  titleColor: string;
  textColor: string;
  items: RelatedItem[];
  customerItems: RelatedCustomerItem[];
  customerItemType: string;
  customerItemRatingType: 'priority' | 'severity' | 'importance';
  customerItemRatingLabel: string;
  itemPlaceholder: string;
  emptyCustomerItemsMessage: string;
  onAdd: (content: string, relatedItemIds: string[]) => void;
  onUpdate: (id: string, content: string, relatedItemIds: string[]) => void;
  onDelete: (id: string) => void;
  formPosition?: 'top' | 'bottom';
}

const RelatedItemList = ({
  title,
  description,
  bgColor,
  titleColor,
  textColor,
  items,
  customerItems,
  customerItemType,
  customerItemRatingType,
  customerItemRatingLabel,
  itemPlaceholder,
  emptyCustomerItemsMessage,
  onAdd,
  onUpdate,
  onDelete,
  formPosition = 'bottom'
}: RelatedItemListProps) => {
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemRelatedIds, setNewItemRelatedIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [activeEditId, setActiveEditId] = useState<string | null>(null);

  // Initialize edit values when items change
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    items.forEach(item => {
      initialValues[item.id] = item.content;
    });
    setEditValues(initialValues);
  }, [items.map(s => s.id).join(',')]);

  const handleInputChange = (itemId: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleInputBlur = (itemId: string) => {
    const item = items.find(s => s.id === itemId);
    if (item && editValues[itemId] !== item.content) {
      onUpdate(itemId, editValues[itemId], item.relatedItemIds);
    }
    setActiveEditId(null);
  };

  const handleAddItem = () => {
    if (newItemContent.trim()) {
      onAdd(newItemContent.trim(), newItemRelatedIds);
      setNewItemContent('');
      setNewItemRelatedIds([]);
      
      // Focus back on the input after adding
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const toggleItemSelection = (customerItemId: string, itemId?: string) => {
    if (itemId) {
      // Update existing item
      const item = items.find(s => s.id === itemId);
      if (item) {
        const updatedItemIds = item.relatedItemIds.includes(customerItemId)
          ? item.relatedItemIds.filter(id => id !== customerItemId)
          : [...item.relatedItemIds, customerItemId];
        
        onUpdate(itemId, editValues[itemId] || item.content, updatedItemIds);
      }
    } else {
      // Update new item form
      setNewItemRelatedIds(prev => 
        prev.includes(customerItemId)
          ? prev.filter(id => id !== customerItemId)
          : [...prev, customerItemId]
      );
    }
  };

  // Get the rating value based on the customerItemRatingType
  const getRating = (item: RelatedCustomerItem) => {
    if (customerItemRatingType === 'priority') return item.priority;
    if (customerItemRatingType === 'severity') return item.severity;
    if (customerItemRatingType === 'importance') return item.importance;
    return undefined;
  };

  // Form to add new items
  const AddItemForm = () => (
    <div className="p-4 border rounded-md space-y-4 mb-4">
      <div className="flex-1">
        <Input 
          ref={inputRef}
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          placeholder={`Add a new ${customerItemType}...`}
          className="w-full"
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-2 block">Related Customer {customerItemType}s:</Label>
        <div className="space-y-2 flex flex-col items-center">
          {customerItems.length > 0 ? (
            customerItems.map((customerItem) => (
              <div key={customerItem.id} className="flex items-center space-x-2 w-full">
                <Checkbox 
                  id={`new-item-${customerItem.id}`} 
                  checked={newItemRelatedIds.includes(customerItem.id)}
                  onCheckedChange={() => toggleItemSelection(customerItem.id)}
                />
                <Label 
                  htmlFor={`new-item-${customerItem.id}`}
                  className="text-sm flex-1"
                >
                  {customerItem.content}
                  {getRating(customerItem) === 'high' && (
                    <span className={`ml-2 text-xs px-1.5 py-0.5 bg-${customerItemRatingLabel === 'priority' ? 'blue' : customerItemRatingLabel === 'severity' ? 'red' : 'green'}-100 text-${customerItemRatingLabel === 'priority' ? 'blue' : customerItemRatingLabel === 'severity' ? 'red' : 'green'}-800 rounded-full`}>
                      High {customerItemRatingLabel.charAt(0).toUpperCase() + customerItemRatingLabel.slice(1)}
                    </span>
                  )}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center w-full">No customer {customerItemType}s available</p>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={handleAddItem}
          disabled={!newItemContent.trim()}
          className="mx-auto"
        >
          <Plus className="h-4 w-4 mr-1" /> Add {title.replace(/s$/, '')}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className={`bg-${bgColor}-50 p-4 rounded-lg`}>
        <h3 className={`text-base font-medium text-${titleColor}-800 mb-2`}>What are {title}?</h3>
        <p className={`text-sm text-${textColor}-700`}>
          {description}
        </p>
      </div>

      {formPosition === 'top' && <AddItemForm />}

      {customerItems.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            {emptyCustomerItemsMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 bg-white border rounded-md">
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex-1">
                  <Input 
                    value={editValues[item.id] !== undefined ? editValues[item.id] : item.content}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                    onFocus={() => setActiveEditId(item.id)}
                    onBlur={() => handleInputBlur(item.id)}
                    placeholder={itemPlaceholder}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3">
                <Label className="text-sm font-medium mb-2 block">Related Customer {customerItemType}s:</Label>
                <div className="space-y-2 flex flex-col items-center">
                  {customerItems.map((customerItem) => (
                    <div key={customerItem.id} className="flex items-center space-x-2 w-full">
                      <Checkbox 
                        id={`item-${item.id}-${customerItem.id}`} 
                        checked={item.relatedItemIds.includes(customerItem.id)}
                        onCheckedChange={() => toggleItemSelection(customerItem.id, item.id)}
                      />
                      <Label 
                        htmlFor={`item-${item.id}-${customerItem.id}`}
                        className="text-sm flex-1"
                      >
                        {customerItem.content}
                        {getRating(customerItem) === 'high' && (
                          <span className={`ml-2 text-xs px-1.5 py-0.5 bg-${customerItemRatingLabel === 'priority' ? 'blue' : customerItemRatingLabel === 'severity' ? 'red' : 'green'}-100 text-${customerItemRatingLabel === 'priority' ? 'blue' : customerItemRatingLabel === 'severity' ? 'red' : 'green'}-800 rounded-full`}>
                            High {customerItemRatingLabel.charAt(0).toUpperCase() + customerItemRatingLabel.slice(1)}
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formPosition === 'bottom' && customerItems.length > 0 && <AddItemForm />}
    </div>
  );
};

export default RelatedItemList;
