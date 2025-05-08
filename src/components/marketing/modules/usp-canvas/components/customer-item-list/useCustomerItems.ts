
import { useState, useRef } from 'react';
import { CustomerItemProps, RatingValue } from './types';

interface UseCustomerItemsProps {
  items: CustomerItemProps[];
  onDelete: (id: string) => void;
  onReorder?: (reorderedItems: CustomerItemProps[]) => void;
}

export const useCustomerItems = ({ items, onDelete, onReorder }: UseCustomerItemsProps) => {
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemRating, setNewItemRating] = useState<RatingValue>('medium');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<null | string>(null);
  const [aiOnlyFilter, setAiOnlyFilter] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'priority-high' | 'priority-low'>('default');
  const newItemInputRef = useRef<HTMLInputElement>(null);

  // Apply sorting if needed
  const ratingValue = (rating: RatingValue): number => {
    switch (rating) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  };

  // Get sorted and filtered items
  const getSortedAndFilteredItems = () => {
    let sortedItems = [...items];
    if (sortOrder === 'priority-high') {
      sortedItems = sortedItems.sort((a, b) => ratingValue(b.rating) - ratingValue(a.rating));
    } else if (sortOrder === 'priority-low') {
      sortedItems = sortedItems.sort((a, b) => ratingValue(a.rating) - ratingValue(b.rating));
    }
    
    // Filter AI-generated items if needed
    return aiOnlyFilter ? sortedItems.filter(item => item.isAIGenerated) : sortedItems;
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

  const handleSort = () => {
    if (sortOrder === 'default') setSortOrder('priority-high');
    else if (sortOrder === 'priority-high') setSortOrder('priority-low');
    else setSortOrder('default');
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
      const currentItems = [...getSortedAndFilteredItems()];
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

  return {
    filteredItems: getSortedAndFilteredItems(),
    aiGeneratedCount: items.filter(item => item.isAIGenerated).length,
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
  };
};
