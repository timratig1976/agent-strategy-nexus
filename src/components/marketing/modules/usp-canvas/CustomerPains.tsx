
import React from 'react';
import { CustomerPain } from './types';
import CustomerItemList from './components/CustomerItemList';

interface CustomerPainsProps {
  pains: CustomerPain[];
  onAdd: (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, severity: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedPains: CustomerPain[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerPains = ({ 
  pains, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onReorder, 
  formPosition = 'bottom' 
}: CustomerPainsProps) => {
  return (
    <CustomerItemList 
      title="Customer Pains"
      tooltipTitle="What are Customer Pains?"
      tooltipContent="Customer pains describe anything that annoys your customers before, during, and after trying to get a job done. This includes undesired outcomes, problems, and obstacles that prevent customers from getting a job done."
      itemType="pain"
      ratingType="severity"
      items={pains.map(pain => ({
        id: pain.id,
        content: pain.content,
        rating: pain.severity,
        isAIGenerated: pain.isAIGenerated
      }))}
      placeholderText="What frustrates or annoys your customer?"
      emptyStateType="pains"
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onReorder={onReorder ? 
        (items) => onReorder(items.map(item => ({
          id: item.id,
          content: item.content,
          severity: item.rating as 'low' | 'medium' | 'high',
          isAIGenerated: item.isAIGenerated
        }))) : 
        undefined
      }
      formPosition={formPosition}
    />
  );
};

export default CustomerPains;
