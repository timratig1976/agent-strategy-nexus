
import React, { useEffect } from 'react';
import { CustomerItemProps, CustomerItemType, RatingType, RatingValue } from './types';
import EmptyState from '../EmptyState';
import AddItemForm from '../AddItemForm';
import SelectedItemsNotification from '../SelectedItemsNotification';
import { CustomerItemHeader } from './';
import { CustomerItemControls } from './';
import { CustomerItemContainer } from './';
import { useCustomerItems } from './useCustomerItems';

interface CustomerItemListProps {
  title: string;
  tooltipTitle: string;
  tooltipContent: string;
  itemType: CustomerItemType;
  ratingType: RatingType;
  items: CustomerItemProps[];
  placeholderText: string;
  emptyStateType: string;
  onAdd: (content: string, rating: RatingValue, isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, rating: RatingValue) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedItems: CustomerItemProps[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerItemList = ({
  title,
  tooltipTitle,
  tooltipContent,
  itemType,
  ratingType,
  items,
  placeholderText,
  emptyStateType,
  onAdd,
  onUpdate,
  onDelete,
  onReorder,
  formPosition = 'bottom'
}: CustomerItemListProps) => {
  const {
    filteredItems,
    aiGeneratedCount,
    newItemContent,
    setNewItemContent,
    newItemRating,
    setNewItemRating,
    selectedItems,
    isSelectMode,
    draggedItem,
    aiOnlyFilter,
    setAiOnlyFilter,
    sortOrder,
    newItemInputRef,
    toggleSelectItem,
    handleDeleteSelected,
    handleDeleteAIGenerated,
    toggleSelectMode,
    handleSort,
    handleDragStart,
    handleDragOver,
    handleDrop
  } = useCustomerItems({ 
    items, 
    onDelete,
    onReorder 
  });

  useEffect(() => {
    // Maintain focus on the input field
    if (formPosition === 'top' && newItemInputRef.current) {
      newItemInputRef.current.focus();
    }
  }, [formPosition]);

  const handleAddItem = () => {
    if (newItemContent.trim()) {
      onAdd(newItemContent.trim(), newItemRating, false);
      setNewItemContent('');
      // Maintain focus on the input
      setTimeout(() => {
        if (newItemInputRef.current) {
          newItemInputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleContentChange = (id: string, content: string) => {
    const item = items.find(item => item.id === id);
    if (item) {
      onUpdate(id, content, item.rating);
    }
  };

  return (
    <div className="space-y-6">
      <CustomerItemHeader 
        title={title}
        tooltipTitle={tooltipTitle}
        tooltipContent={tooltipContent}
      />

      {formPosition === 'top' && (
        <AddItemForm 
          value={newItemContent}
          onChange={setNewItemContent}
          onAdd={handleAddItem}
          rating={newItemRating}
          onRatingChange={setNewItemRating}
          inputRef={newItemInputRef}
          placeholder={`Add a new ${itemType}...`}
          ratingLabel={itemType}
        />
      )}

      <CustomerItemControls 
        aiOnlyFilter={aiOnlyFilter}
        setAiOnlyFilter={setAiOnlyFilter}
        aiGeneratedCount={aiGeneratedCount}
        handleDeleteAIGenerated={handleDeleteAIGenerated}
        isSelectMode={isSelectMode}
        toggleSelectMode={toggleSelectMode}
        hasItems={items.length > 0}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />

      <SelectedItemsNotification 
        selectedCount={selectedItems.length}
        handleDeleteSelected={handleDeleteSelected}
        itemLabel={`${emptyStateType}`}
      />

      {filteredItems.length === 0 ? (
        <EmptyState aiOnlyFilter={aiOnlyFilter} itemType={emptyStateType} />
      ) : (
        <CustomerItemContainer 
          items={filteredItems}
          ratingType={ratingType}
          isSelectMode={isSelectMode}
          draggedItem={draggedItem}
          selectedItems={selectedItems}
          onContentChange={handleContentChange}
          onToggleSelect={toggleSelectItem}
          onDelete={onDelete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          placeholderText={placeholderText}
        />
      )}

      {formPosition === 'bottom' && (
        <AddItemForm 
          value={newItemContent}
          onChange={setNewItemContent}
          onAdd={handleAddItem}
          rating={newItemRating}
          onRatingChange={setNewItemRating}
          inputRef={newItemInputRef}
          placeholder={`Add a new ${itemType}...`}
          ratingLabel={itemType}
        />
      )}
    </div>
  );
};

export default CustomerItemList;
