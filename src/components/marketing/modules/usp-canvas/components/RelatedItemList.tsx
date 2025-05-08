
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import RelatedItemCard from './related-item-list/RelatedItemCard';
import RelatedItemForm from './related-item-list/RelatedItemForm';
import { RelatedItem, RelatedCustomerItem } from './related-item-list/types';

interface RelatedItemListProps {
  title?: string;
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

  const handleAddItem = () => {
    if (newItemContent.trim()) {
      onAdd(newItemContent.trim(), newItemRelatedIds);
      setNewItemContent('');
      setNewItemRelatedIds([]);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setNewItemRelatedIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getRating = (item: RelatedCustomerItem): 'low' | 'medium' | 'high' | undefined => {
    if ('priority' in item) return item.priority;
    if ('severity' in item) return item.severity;
    if ('importance' in item) return item.importance;
    return undefined;
  };

  const renderForm = () => (
    <RelatedItemForm
      newItemContent={newItemContent}
      setNewItemContent={setNewItemContent}
      newItemRelatedIds={newItemRelatedIds}
      toggleItemSelection={toggleItemSelection}
      customerItems={customerItems}
      customerItemType={customerItemType}
      customerItemRatingType={customerItemRatingType}
      customerItemRatingLabel={customerItemRatingLabel}
      handleAddItem={handleAddItem}
      getRating={getRating}
      itemPlaceholder={itemPlaceholder}
    />
  );
  
  return (
    <div className="mt-4">
      {formPosition === 'top' && renderForm()}
      
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map(item => (
            <RelatedItemCard
              key={item.id}
              itemId={item.id}
              content={item.content}
              relatedItemIds={item.relatedItemIds}
              customerItems={customerItems}
              customerItemType={customerItemType}
              customerItemRatingType={customerItemRatingType}
              customerItemRatingLabel={customerItemRatingLabel}
              editValues={{}}
              activeEditId={null}
              handleInputChange={() => {}}
              setActiveEditId={() => {}}
              handleInputBlur={() => {}}
              toggleItemSelection={() => {}}
              onDelete={() => onDelete(item.id)}
              getRating={getRating}
              itemPlaceholder={itemPlaceholder}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center border border-dashed rounded-md">
          <p className="text-muted-foreground mb-3">
            {customerItems.length === 0 
              ? emptyCustomerItemsMessage 
              : `No ${title || 'items'} added yet.`}
          </p>
        </div>
      )}
      
      {formPosition === 'bottom' && renderForm()}
    </div>
  );
};

export default RelatedItemList;
