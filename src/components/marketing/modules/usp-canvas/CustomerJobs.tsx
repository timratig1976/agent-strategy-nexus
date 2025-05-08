
import React, { useState, useRef, useEffect } from 'react';
import { CustomerJob } from './types';
import EmptyState from './components/EmptyState';
import ItemCard from './components/ItemCard';
import AddItemForm from './components/AddItemForm';
import ItemListControls from './components/ItemListControls';
import SelectedItemsNotification from './components/SelectedItemsNotification';
import SectionHeader from './components/SectionHeader';

interface CustomerJobsProps {
  jobs: CustomerJob[];
  onAdd: (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, priority: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedJobs: CustomerJob[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerJobs = ({ jobs, onAdd, onUpdate, onDelete, onReorder, formPosition = 'bottom' }: CustomerJobsProps) => {
  const [newJobContent, setNewJobContent] = useState('');
  const [newJobPriority, setNewJobPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [sortOrder, setSortOrder] = useState<'default' | 'priority-high' | 'priority-low'>('default');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<null | string>(null);
  const [aiOnlyFilter, setAiOnlyFilter] = useState<boolean>(false);
  const newJobInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Maintain focus on the input field when state changes
    if (formPosition === 'top' && newJobInputRef.current) {
      newJobInputRef.current.focus();
    }
  }, [formPosition]);

  const handleAddJob = () => {
    if (newJobContent.trim()) {
      onAdd(newJobContent.trim(), newJobPriority, false);
      setNewJobContent('');
      // Maintain focus on the input
      setTimeout(() => {
        if (newJobInputRef.current) {
          newJobInputRef.current.focus();
        }
      }, 0);
    }
  };

  const toggleSelectJob = (jobId: string) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  const handleDeleteSelected = () => {
    selectedJobs.forEach(id => onDelete(id));
    setSelectedJobs([]);
    setIsSelectMode(false);
  };

  const handleDeleteAIGenerated = () => {
    const aiGeneratedJobs = jobs.filter(job => job.isAIGenerated).map(job => job.id);
    aiGeneratedJobs.forEach(id => onDelete(id));
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedJobs([]);
  };

  const priorityValue = (priority: 'low' | 'medium' | 'high'): number => {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
    }
  };

  let sortedJobs = [...jobs];
  if (sortOrder === 'priority-high') {
    sortedJobs = sortedJobs.sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority));
  } else if (sortOrder === 'priority-low') {
    sortedJobs = sortedJobs.sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority));
  }

  // Apply AI filter if selected
  if (aiOnlyFilter) {
    sortedJobs = sortedJobs.filter(job => job.isAIGenerated);
  }

  const handleSort = () => {
    if (sortOrder === 'default') setSortOrder('priority-high');
    else if (sortOrder === 'priority-high') setSortOrder('priority-low');
    else setSortOrder('default');
  };

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    setDraggedItem(jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem !== null && draggedItem !== targetId && onReorder) {
      const currentJobs = [...sortedJobs];
      const draggedIndex = currentJobs.findIndex(job => job.id === draggedItem);
      const targetIndex = currentJobs.findIndex(job => job.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = currentJobs.splice(draggedIndex, 1);
        currentJobs.splice(targetIndex, 0, removed);
        onReorder(currentJobs);
      }
    }
    
    setDraggedItem(null);
  };

  const aiGeneratedCount = jobs.filter(job => job.isAIGenerated).length;

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Customer Jobs"
        tooltipTitle="What are Customer Jobs?"
        tooltipContent="Customer jobs describe what your customers are trying to get done in their work and lives. These could be tasks they're trying to complete, problems they're trying to solve, or needs they're trying to satisfy."
      />

      {formPosition === 'top' && (
        <AddItemForm 
          value={newJobContent}
          onChange={setNewJobContent}
          onAdd={handleAddJob}
          rating={newJobPriority}
          onRatingChange={setNewJobPriority}
          inputRef={newJobInputRef}
          placeholder="Add a new customer job..."
          ratingLabel="job"
        />
      )}

      <ItemListControls 
        aiOnlyFilter={aiOnlyFilter}
        setAiOnlyFilter={setAiOnlyFilter}
        aiGeneratedCount={aiGeneratedCount}
        handleDeleteAIGenerated={handleDeleteAIGenerated}
        isSelectMode={isSelectMode}
        toggleSelectMode={toggleSelectMode}
        hasItems={jobs.length > 0}
        sortOrder={sortOrder}
        handleSort={handleSort}
      />

      <SelectedItemsNotification 
        selectedCount={selectedJobs.length}
        handleDeleteSelected={handleDeleteSelected}
        itemLabel="jobs"
      />

      {sortedJobs.length === 0 ? (
        <EmptyState aiOnlyFilter={aiOnlyFilter} itemType="jobs" />
      ) : (
        <div className="space-y-2">
          {sortedJobs.map((job) => (
            <ItemCard 
              key={job.id}
              id={job.id}
              content={job.content}
              rating={job.priority}
              ratingLabel="priority"
              isAIGenerated={job.isAIGenerated}
              isSelected={selectedJobs.includes(job.id)}
              isSelectMode={isSelectMode}
              isDragged={draggedItem === job.id}
              isDraggable={onReorder !== undefined}
              onContentChange={(value) => onUpdate(job.id, value, job.priority)}
              onToggleSelect={() => toggleSelectJob(job.id)}
              onDelete={() => onDelete(job.id)}
              onDragStart={(e) => handleDragStart(e, job.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, job.id)}
              placeholderText="What job is your customer trying to get done?"
            />
          ))}
        </div>
      )}

      {formPosition === 'bottom' && (
        <AddItemForm 
          value={newJobContent}
          onChange={setNewJobContent}
          onAdd={handleAddJob}
          rating={newJobPriority}
          onRatingChange={setNewJobPriority}
          inputRef={newJobInputRef}
          placeholder="Add a new customer job..."
          ratingLabel="job"
        />
      )}
    </div>
  );
};

export default CustomerJobs;
