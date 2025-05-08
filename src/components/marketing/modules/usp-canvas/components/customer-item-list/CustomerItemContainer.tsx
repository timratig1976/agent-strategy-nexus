
import React from 'react';
import { CustomerItemProps } from './types';
import ItemCard from '../ItemCard';

interface CustomerItemContainerProps {
  items: CustomerItemProps[];
  ratingType: string;
  isSelectMode: boolean;
  draggedItem: string | null;
  selectedItems: string[];
  onContentChange: (id: string, value: string) => void;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: string) => void;
  placeholderText: string;
}

const CustomerItemContainer = ({
  items,
  ratingType,
  isSelectMode,
  draggedItem,
  selectedItems,
  onContentChange,
  onToggleSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  placeholderText
}: CustomerItemContainerProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
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
          isDraggable={true}
          onContentChange={(value) => onContentChange(item.id, value)}
          onToggleSelect={() => onToggleSelect(item.id)}
          onDelete={() => onDelete(item.id)}
          onDragStart={(e) => onDragStart(e, item.id)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, item.id)}
          placeholderText={placeholderText}
        />
      ))}
    </div>
  );
};

export default CustomerItemContainer;
