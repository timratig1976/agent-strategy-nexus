import React from 'react';
import { CustomerGain } from './types';
import CustomerItemList from './components/customer-item-list';

interface CustomerGainsProps {
  gains: CustomerGain[];
  onAdd: (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedGains: CustomerGain[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerGains = ({ 
  gains, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onReorder, 
  formPosition = 'bottom' 
}: CustomerGainsProps) => {
  return (
    <CustomerItemList 
      title="Customer Gains"
      tooltipTitle="What are Customer Gains?"
      tooltipContent="Customer gains describe the outcomes and benefits your customers want. Some are required, expected, or desired, and some would surprise them. These include functional utility, social gains, positive emotions, and cost savings."
      itemType="gain"
      ratingType="importance"
      items={gains.map(gain => ({
        id: gain.id,
        content: gain.content,
        rating: gain.importance,
        isAIGenerated: gain.isAIGenerated
      }))}
      placeholderText="What benefits does your customer desire?"
      emptyStateType="gains"
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onReorder={onReorder ? 
        (items) => onReorder(items.map(item => ({
          id: item.id,
          content: item.content,
          importance: item.rating as 'low' | 'medium' | 'high',
          isAIGenerated: item.isAIGenerated
        }))) : 
        undefined
      }
      formPosition={formPosition}
    />
  );
};

export default CustomerGains;
