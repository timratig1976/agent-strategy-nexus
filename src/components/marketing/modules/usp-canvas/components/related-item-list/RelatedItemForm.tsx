
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { RelatedCustomerItem } from './types';

interface RelatedItemFormProps {
  newItemContent: string;
  setNewItemContent: (content: string) => void;
  newItemRelatedIds: string[];
  toggleItemSelection: (customerItemId: string) => void;
  customerItems: RelatedCustomerItem[];
  customerItemType: string;
  customerItemRatingType: 'priority' | 'severity' | 'importance';
  customerItemRatingLabel: string;
  handleAddItem: () => void;
  getRating: (item: RelatedCustomerItem) => 'low' | 'medium' | 'high' | undefined;
}

const RelatedItemForm = ({
  newItemContent,
  setNewItemContent,
  newItemRelatedIds,
  toggleItemSelection,
  customerItems,
  customerItemType,
  customerItemRatingType,
  customerItemRatingLabel,
  handleAddItem,
  getRating
}: RelatedItemFormProps) => {
  // This ref will be used to focus the input
  const inputRef = useRef<HTMLInputElement>(null);

  // Effect to focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Function to handle submit and maintain focus
  const handleSubmit = () => {
    if (newItemContent.trim()) {
      handleAddItem();
      // Focus back on the input after adding
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle keyboard event to submit on Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newItemContent.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Get the correct background color class based on the item rating type
  const getBgColorClass = (type: string) => {
    switch (type) {
      case 'priority':
        return 'bg-blue-100 text-blue-800';
      case 'severity':
        return 'bg-red-100 text-red-800';
      case 'importance':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 border rounded-md mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input 
                ref={inputRef}
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                placeholder={`Add a new ${customerItemType}...`}
                className="w-full"
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            
            <Button 
              onClick={handleSubmit}
              disabled={!newItemContent.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>
        
        <div>
          {customerItems.length > 0 ? (
            <div>
              <Label className="text-sm font-medium mb-2 block">Related {customerItemType}s:</Label>
              <div className="max-h-48 overflow-y-auto p-2 border rounded-md bg-slate-50">
                <div className="grid grid-cols-1 gap-1">
                  {customerItems.map((customerItem) => (
                    <div key={customerItem.id} className="flex items-center space-x-2 py-1">
                      <Checkbox 
                        id={`new-item-${customerItem.id}`} 
                        checked={newItemRelatedIds.includes(customerItem.id)}
                        onCheckedChange={() => toggleItemSelection(customerItem.id)}
                      />
                      <Label 
                        htmlFor={`new-item-${customerItem.id}`}
                        className="text-sm flex-1 cursor-pointer"
                      >
                        <span className="line-clamp-1">{customerItem.content}</span>
                        {getRating(customerItem) === 'high' && (
                          <span className={`ml-1 text-xs px-1 py-0.5 rounded-full inline-flex items-center ${getBgColorClass(customerItemRatingLabel)}`}>
                            High
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center mt-2">
              No customer {customerItemType}s available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatedItemForm;
