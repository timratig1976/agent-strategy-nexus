
import React, { useState, useRef, useEffect } from 'react';
import { CustomerJob, CustomerPain, CustomerGain } from '../types';
import EmptyState from './EmptyState';
import ItemCard from './ItemCard';
import AddItemForm from './AddItemForm';
import ItemListControls from './ItemListControls';
import SelectedItemsNotification from './SelectedItemsNotification';
import SectionHeader from './SectionHeader';

export type CustomerItemType = 'job' | 'pain' | 'gain';
export type RatingType = 'priority' | 'severity' | 'importance';
export type RatingValue = 'low' | 'medium' | 'high';

export interface CustomerItemProps {
  id: string;
  content: string;
  rating: RatingValue;
  isAIGenerated?: boolean;
}

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
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemRating, setNewItemRating] = useState<RatingValue>('medium');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<null | string>(null);
  const [aiOnlyFilter, setAiOnlyFilter] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'priority-high' | 'priority-low'>('default');
  const newItemInputRef = useRef<HTMLInputElement>(null);

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

  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleDeleteSelected = () => {
    selectedItems.forEach(id => onDelete(id));
    setSelectedItems([]);
    setIsSelectMode(false);
  };

  const handleDeleteAIGenerated = () => {
    const aiGeneratedItems = items.filter(item => item.isAIGenerated).map(item => item.id);
    aiGeneratedItems.forEach(id => onDelete(id));
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedItems([]);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem !== null && draggedItem !== targetId && onReorder) {
      const currentItems = [...filteredItems];
      const draggedIndex = currentItems.findIndex(item => item.id === draggedItem);
      const targetIndex = currentItems.findIndex(item => item.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = currentItems.splice(draggedIndex, 1);
        currentItems.splice(targetIndex, 0, removed);
        onReorder(currentItems);
      }
    }
    
    setDraggedItem(null);
  };

  const handleSort = () => {
    if (sortOrder === 'default') setSortOrder('priority-high');
    else if (sortOrder === 'priority-high') setSortOrder('priority-low');
    else setSortOrder('default');
  };

  const ratingValue = (rating: RatingValue): number => {
    switch (rating) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  };

  // Apply sorting if needed
  let sortedItems = [...items];
  if (sortOrder === 'priority-high') {
    sortedItems = sortedItems.sort((a, b) => ratingValue(b.rating) - ratingValue(a.rating));
  } else if (sortOrder === 'priority-low') {
    sortedItems = sortedItems.sort((a, b) => ratingValue(a.rating) - ratingValue(b.rating));
  }

  // Filter AI-generated items if needed
  const filteredItems = aiOnlyFilter ? sortedItems.filter(item => item.isAIGenerated) : sortedItems;
  const aiGeneratedCount = items.filter(item => item.isAIGenerated).length;

  return (
    <div className="space-y-6">
      <SectionHeader 
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

      <ItemListControls 
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
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <ItemCard 
              key={item.id}
              id={item.id}
              content={item.content}
              rating={item.rating}
              ratingLabel={ratingType}
              isAIGenerated={item.isAIGenerated}
              isSelected={selectedItems.includes(item.id)}
              isSelectMode={isSelectMode}
              isDragged={draggedItem === item.id}
              isDraggable={onReorder !== undefined}
              onContentChange={(value) => onUpdate(item.id, value, item.rating)}
              onToggleSelect={() => toggleSelectItem(item.id)}
              onDelete={() => onDelete(item.id)}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item.id)}
              placeholderText={placeholderText}
            />
          ))}
        </div>
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
