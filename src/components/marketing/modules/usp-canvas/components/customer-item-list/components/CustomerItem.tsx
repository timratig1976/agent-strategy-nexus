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
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  placeholderText
}) => {
  return (
    <div className="customer-item">
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
        isDraggable={false} // Disable draggable since we're using buttons
        onContentChange={onContentChange}
        onToggleSelect={onToggleSelect}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        // Keep these but they won't be actively used
        onDragStart={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        placeholderText={placeholderText}
      />
    </div>
  );
};

export default CustomerItem;
