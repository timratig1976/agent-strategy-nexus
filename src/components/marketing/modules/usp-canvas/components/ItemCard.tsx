
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Trash2, 
  GripVertical,
  CheckSquare, 
  Square, 
  User, 
  Bot 
} from "lucide-react";

interface ItemCardProps {
  id: string;
  content: string;
  rating: 'low' | 'medium' | 'high';
  ratingLabel: string;
  isAIGenerated?: boolean;
  isSelected: boolean;
  isSelectMode: boolean;
  isDragged: boolean;
  isDraggable: boolean;
  onContentChange: (value: string) => void;
  onToggleSelect: () => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  placeholderText: string;
}

const ItemCard = ({
  id,
  content,
  rating,
  ratingLabel,
  isAIGenerated = false,
  isSelected,
  isSelectMode,
  isDragged,
  isDraggable,
  onContentChange,
  onToggleSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  placeholderText
}: ItemCardProps) => {
  const getBadgeVariant = () => {
    switch (rating) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'success';
    }
  };

  return (
    <div 
      className={`p-3 bg-white border rounded-md ${
        isSelectMode && isSelected ? 'border-primary bg-primary/5' : ''
      } ${isDragged ? 'opacity-50' : 'opacity-100'}`}
      draggable={isDraggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center space-x-2">
        {isDraggable && (
          <div className="cursor-grab">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        {isSelectMode ? (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={onToggleSelect}
          >
            {isSelected ? (
              <CheckSquare className="h-5 w-5 text-primary" />
            ) : (
              <Square className="h-5 w-5" />
            )}
          </Button>
        ) : null}
        
        <Badge 
          variant={getBadgeVariant()}
          className="w-16 flex justify-center"
        >
          {rating.charAt(0).toUpperCase() + rating.slice(1)}
        </Badge>
        
        <div className="flex-1">
          <Input 
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholderText}
          />
        </div>
        
        {isAIGenerated ? (
          <Bot className="h-5 w-5 text-blue-500 mr-1" />
        ) : (
          <User className="h-5 w-5 text-gray-500 mr-1" />
        )}
        
        {!isSelectMode && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
