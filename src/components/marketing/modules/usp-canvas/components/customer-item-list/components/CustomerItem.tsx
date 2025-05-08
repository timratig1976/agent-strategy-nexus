
import React from 'react';
import ItemCard from '../../ItemCard';
import { RatingValue } from '../types';

interface CustomerItemProps {
  id: string;
  content: string;
  rating: RatingValue; // Changed from string to RatingValue
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
    <ItemCard 
      key={id}
      id={id}
      content={content}
      rating={rating}
      ratingLabel="priority" // Changed from rating to a fixed value
      isAIGenerated={isAIGenerated}
      isSelected={isSelected}
      isSelectMode={isSelectMode}
      isDragged={isDragged}
      isDraggable={true}
      onContentChange={onContentChange}
      onToggleSelect={onToggleSelect}
      onDelete={onDelete}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      placeholderText={placeholderText}
    />
  );
};

export default CustomerItem;
