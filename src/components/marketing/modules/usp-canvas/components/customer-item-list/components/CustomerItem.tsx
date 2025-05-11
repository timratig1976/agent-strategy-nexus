
import React from 'react';
import ItemCard from '../../ItemCard';
import { RatingValue } from '../types';

interface CustomerItemProps {
  id: string;
  content: string;
  rating: RatingValue;
  isAIGenerated?: boolean;
  isSelected: boolean;
  isSelectMode: boolean;
  isDragged: boolean;
  onContentChange: (value: string) => void;
  onToggleSelect: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  placeholderText: string;
}

const CustomerItem: React.FC<CustomerItemProps> = ({
  id,
  content,
  rating,
  isAIGenerated,
  isSelected,
  isSelectMode,
  isDragged,
  onContentChange,
  onToggleSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  placeholderText
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log(`Starting drag for item: ${id}`);
    // Set the drag data for better compatibility across browsers
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    // Call the parent onDragStart handler
    onDragStart(e);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // This is critical to allow dropping
    e.dataTransfer.dropEffect = 'move';
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    console.log(`Drop event on item: ${id}`);
    // This item becomes the target
    onDrop(e);
  };

  return (
    <div 
      draggable={true}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`${isDragged ? 'opacity-50' : 'opacity-100'} cursor-grab ${isDragged ? 'border-2 border-dashed border-primary' : ''}`}
      data-item-id={id}
    >
      <ItemCard 
        key={id}
        id={id}
        content={content}
        rating={rating}
        ratingLabel="priority"
        isAIGenerated={isAIGenerated}
        isSelected={isSelected}
        isSelectMode={isSelectMode}
        isDragged={isDragged}
        isDraggable={true}
        onContentChange={onContentChange}
        onToggleSelect={onToggleSelect}
        onDelete={onDelete}
        // Use empty handlers for the inner ItemCard since we're handling drag at the container level
        onDragStart={(e) => e.stopPropagation()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        placeholderText={placeholderText}
      />
    </div>
  );
};

export default CustomerItem;
