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

  // Get filtered items (no sorting applied)
  const getSortedAndFilteredItems = () => {
    // Only filtering is applied, no sorting
    return aiOnlyFilter ? items.filter(item => item.isAIGenerated) : items;
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

  // This is now a no-op since we've removed sorting functionality
  const handleSort = () => {
    // Removed sorting functionality
  };

  // Move item up (swap with previous item)
  const handleMoveUp = (index: number) => {
    if (!onReorder || index <= 0) return;
    
    // Create a copy of the filtered/sorted items
    const currentItems = [...getSortedAndFilteredItems()];
    
    // Swap current item with the one above it
    const temp = currentItems[index];
    currentItems[index] = currentItems[index - 1];
    currentItems[index - 1] = temp;
    
    // If filtering is active, we need to merge back with non-filtered items
    if (aiOnlyFilter) {
      const nonFilteredItems = items.filter(item => !item.isAIGenerated);
      onReorder([...currentItems, ...nonFilteredItems]);
    } else {
      onReorder(currentItems);
    }
    
    console.log("Moved item up:", currentItems.map(item => item.id));
  };

  // Move item down (swap with next item)
  const handleMoveDown = (index: number) => {
    const currentItems = [...getSortedAndFilteredItems()];
    if (!onReorder || index >= currentItems.length - 1) return;
    
    // Swap current item with the one below it
    const temp = currentItems[index];
    currentItems[index] = currentItems[index + 1];
    currentItems[index + 1] = temp;
    
    // If filtering is active, we need to merge back with non-filtered items
    if (aiOnlyFilter) {
      const nonFilteredItems = items.filter(item => !item.isAIGenerated);
      onReorder([...currentItems, ...nonFilteredItems]);
    } else {
      onReorder(currentItems);
    }
    
    console.log("Moved item down:", currentItems.map(item => item.id));
  };

  // We'll keep these for backward compatibility
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    e.preventDefault(); // Prevent default drag behavior since we're using buttons now
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
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
    handleMoveUp,
    handleMoveDown,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
};
