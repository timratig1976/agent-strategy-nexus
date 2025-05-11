
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
  return (
    <div 
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e);
      }}
      className={`${isDragged ? 'opacity-50' : 'opacity-100'}`}
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
        onDragStart={(e) => e.stopPropagation()} // Prevent double handling
        onDragOver={(e) => e.stopPropagation()} // Prevent double handling
        onDrop={(e) => e.stopPropagation()} // Prevent double handling
        placeholderText={placeholderText}
      />
    </div>
  );
};

export default CustomerItem;
