
import { useState, useRef, useEffect } from 'react';
import { RelatedCustomerItem } from './types';

export const useRelatedItems = (customerItems: RelatedCustomerItem[], customerItemRatingType: 'priority' | 'severity' | 'importance') => {
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemRelatedIds, setNewItemRelatedIds] = useState<string[]>([]);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get the rating value based on the customerItemRatingType
  const getRating = (item: RelatedCustomerItem) => {
    if (customerItemRatingType === 'priority') return item.priority;
    if (customerItemRatingType === 'severity') return item.severity;
    if (customerItemRatingType === 'importance') return item.importance;
    return undefined;
  };

  // Toggle item selection for relationship management
  const toggleItemSelection = (customerItemId: string, itemId?: string) => {
    if (!itemId) {
      // For new item form
      setNewItemRelatedIds(prev => 
        prev.includes(customerItemId)
          ? prev.filter(id => id !== customerItemId)
          : [...prev, customerItemId]
      );
    }
    // Note: The update for existing items is handled in the parent component
  };

  return {
    newItemContent,
    setNewItemContent,
    newItemRelatedIds,
    setNewItemRelatedIds,
    editValues,
    setEditValues,
    activeEditId,
    setActiveEditId,
    inputRef,
    getRating,
    toggleItemSelection
  };
};
