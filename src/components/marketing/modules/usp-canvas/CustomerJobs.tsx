
import React from 'react';
import { CustomerJob } from './types';
import CustomerItemList from './components/customer-item-list';

interface CustomerJobsProps {
  jobs: CustomerJob[];
  onAdd: (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, priority: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedJobs: CustomerJob[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerJobs = ({ 
  jobs, 
  onAdd, 
  onUpdate, 
  onDelete, 
  onReorder, 
  formPosition = 'bottom' 
}: CustomerJobsProps) => {
  return (
    <CustomerItemList 
      title="Customer Jobs"
      tooltipTitle="What are Customer Jobs?"
      tooltipContent="Customer jobs describe what your customers are trying to get done in their work and lives. These could be tasks they're trying to complete, problems they're trying to solve, or needs they're trying to satisfy."
      itemType="job"
      ratingType="priority"
      items={jobs.map(job => ({
        id: job.id,
        content: job.content,
        rating: job.priority,
        isAIGenerated: job.isAIGenerated
      }))}
      placeholderText="What job is your customer trying to get done?"
      emptyStateType="jobs"
      onAdd={onAdd}
      onUpdate={onUpdate}
      onDelete={onDelete}
      onReorder={onReorder ? 
        (items) => onReorder(items.map(item => ({
          id: item.id,
          content: item.content,
          priority: item.rating as 'low' | 'medium' | 'high',
          isAIGenerated: item.isAIGenerated
        }))) : 
        undefined
      }
      formPosition={formPosition}
    />
  );
};

export default CustomerJobs;
