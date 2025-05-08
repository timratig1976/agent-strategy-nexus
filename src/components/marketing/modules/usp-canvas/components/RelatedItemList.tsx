
import React, { useEffect } from 'react';
import { 
  RelatedItemHeader, 
  RelatedItemForm, 
  RelatedItemCard, 
  RelatedCustomerItem 
} from './related-item-list';
import { useRelatedItems } from './related-item-list/useRelatedItems';

export interface RelatedItem {
  id: string;
  content: string;
  relatedItemIds: string[];
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
  const {
    newItemContent,
    setNewItemContent,
    newItemRelatedIds,
    setNewItemRelatedIds,
    editValues,
    setEditValues,
    activeEditId,
    setActiveEditId,
    inputRef,
    getRating,
    toggleItemSelection
  } = useRelatedItems(customerItems, customerItemRatingType);

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

  const handleToggleItemSelection = (customerItemId: string, itemId?: string) => {
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
      // For new item form
      toggleItemSelection(customerItemId);
    }
  };

  // Form to add new items
  const AddItemFormComponent = () => (
    <RelatedItemForm
      newItemContent={newItemContent}
      setNewItemContent={setNewItemContent}
      newItemRelatedIds={newItemRelatedIds}
      toggleItemSelection={(customerItemId) => handleToggleItemSelection(customerItemId)}
      customerItems={customerItems}
      customerItemType={customerItemType}
      customerItemRatingType={customerItemRatingType}
      customerItemRatingLabel={customerItemRatingLabel}
      handleAddItem={handleAddItem}
      getRating={getRating}
    />
  );

  return (
    <div className="space-y-6">
      <RelatedItemHeader
        title={title}
        description={description}
        bgColor={bgColor}
        titleColor={titleColor}
        textColor={textColor}
      />

      {formPosition === 'top' && <AddItemFormComponent />}

      {customerItems.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            {emptyCustomerItemsMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <RelatedItemCard
              key={item.id}
              itemId={item.id}
              content={item.content}
              relatedItemIds={item.relatedItemIds}
              customerItems={customerItems}
              customerItemType={customerItemType}
              customerItemRatingType={customerItemRatingType}
              customerItemRatingLabel={customerItemRatingLabel}
              editValues={editValues}
              activeEditId={activeEditId}
              handleInputChange={handleInputChange}
              setActiveEditId={setActiveEditId}
              handleInputBlur={handleInputBlur}
              toggleItemSelection={handleToggleItemSelection}
              onDelete={onDelete}
              getRating={getRating}
              itemPlaceholder={itemPlaceholder}
            />
          ))}
        </div>
      )}

      {formPosition === 'bottom' && customerItems.length > 0 && <AddItemFormComponent />}
    </div>
  );
};

export default RelatedItemList;
