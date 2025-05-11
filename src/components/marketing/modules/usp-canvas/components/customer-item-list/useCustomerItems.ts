
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

  // Get filtered items (sorting is now removed)
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

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    // Set data transfer to make dragging work across all browsers
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem !== null && draggedItem !== targetId && onReorder) {
      // Get the current filtered items that match what the user sees
      const currentItems = [...getSortedAndFilteredItems()];
      const draggedIndex = currentItems.findIndex(item => item.id === draggedItem);
      const targetIndex = currentItems.findIndex(item => item.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Create a new array with the item moved to the new position
        const reorderedItems = [...currentItems];
        const [removed] = reorderedItems.splice(draggedIndex, 1);
        reorderedItems.splice(targetIndex, 0, removed);
        
        // If we're filtering, we need to merge the reordered filtered items with the non-filtered ones
        if (aiOnlyFilter) {
          const nonFilteredItems = items.filter(item => !item.isAIGenerated);
          const finalOrder = [...reorderedItems, ...nonFilteredItems];
          onReorder(finalOrder);
        } else {
          // Call the onReorder callback with the new order
          onReorder(reorderedItems);
        }
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
