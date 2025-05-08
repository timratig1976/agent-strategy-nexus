
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomerJob } from './types';
import { Trash2, Plus, ArrowUpDown, CheckSquare, Square, GripVertical, User, Bot, HelpCircle, Filter } from "lucide-react";

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

  // Compact form to add new jobs
  const AddJobForm = () => (
    <div className="p-4 border rounded-md mb-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[200px]">
          <Input 
            ref={newJobInputRef}
            value={newJobContent}
            onChange={(e) => setNewJobContent(e.target.value)}
            placeholder="Add a new customer job..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newJobContent.trim()) {
                handleAddJob();
                e.preventDefault();
              }
            }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroup 
            value={newJobPriority} 
            onValueChange={(value) => setNewJobPriority(value as 'low' | 'medium' | 'high')}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="low" id="new-job-low" />
              <Label htmlFor="new-job-low" className="text-xs">Low</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="medium" id="new-job-medium" />
              <Label htmlFor="new-job-medium" className="text-xs">Medium</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="high" id="new-job-high" />
              <Label htmlFor="new-job-high" className="text-xs">High</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleAddJob}
          disabled={!newJobContent.trim()}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );

  const aiGeneratedCount = jobs.filter(job => job.isAIGenerated).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Customer Jobs</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <div className="space-y-2">
                <p className="font-medium">What are Customer Jobs?</p>
                <p className="text-sm">
                  Customer jobs describe what your customers are trying to get done in their work and lives. 
                  These could be tasks they're trying to complete, problems they're trying to solve, or needs they're trying to satisfy.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {formPosition === 'top' && <AddJobForm />}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSort}
            className="flex items-center gap-1 text-xs"
          >
            <ArrowUpDown className="h-3 w-3" />
            {sortOrder === 'default' ? 'Order' : 
             sortOrder === 'priority-high' ? 'High→Low' : 'Low→High'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiOnlyFilter(!aiOnlyFilter)}
            className={`flex items-center gap-1 text-xs ${aiOnlyFilter ? 'bg-primary/10' : ''}`}
          >
            <Filter className="h-3 w-3" />
            AI Only
          </Button>
          
          {aiGeneratedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAIGenerated}
              className="flex items-center gap-1 text-xs text-red-500"
            >
              <Trash2 className="h-3 w-3" />
              Clear AI ({aiGeneratedCount})
            </Button>
          )}
        </div>
        
        {jobs.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSelectMode}
            className="text-xs"
          >
            {isSelectMode ? 'Cancel' : 'Select'}
          </Button>
        )}
      </div>

      {isSelectMode && selectedJobs.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
          <span className="text-sm">{selectedJobs.length} jobs selected</span>
          <Button 
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            className="text-xs"
          >
            Delete Selected
          </Button>
        </div>
      )}

      {sortedJobs.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            {aiOnlyFilter 
              ? "No AI-generated jobs found. Generate some using the AI Generator tab." 
              : "No jobs added yet. Add your first customer job above."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedJobs.map((job) => (
            <div 
              key={job.id} 
              className={`p-3 bg-white border rounded-md ${
                isSelectMode && selectedJobs.includes(job.id) ? 'border-primary bg-primary/5' : ''
              } ${draggedItem === job.id ? 'opacity-50' : 'opacity-100'}`}
              draggable={onReorder !== undefined}
              onDragStart={(e) => handleDragStart(e, job.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, job.id)}
            >
              <div className="flex items-center space-x-2">
                {onReorder && (
                  <div className="cursor-grab">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                
                {isSelectMode ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 w-6"
                    onClick={() => toggleSelectJob(job.id)}
                  >
                    {selectedJobs.includes(job.id) ? (
                      <CheckSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </Button>
                ) : null}
                
                <Badge 
                  variant={job.priority === 'high' ? 'destructive' : 
                          job.priority === 'medium' ? 'warning' : 'success'}
                  className="w-16 flex justify-center"
                >
                  {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                </Badge>
                
                <div className="flex-1">
                  <Input 
                    value={job.content}
                    onChange={(e) => onUpdate(job.id, e.target.value, job.priority)}
                    placeholder="What job is your customer trying to get done?"
                  />
                </div>
                
                {job.isAIGenerated ? (
                  <Bot className="h-5 w-5 text-blue-500 mr-1" />
                ) : (
                  <User className="h-5 w-5 text-gray-500 mr-1" />
                )}
                
                {!isSelectMode && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(job.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {formPosition === 'bottom' && <AddJobForm />}
    </div>
  );
};

export default CustomerJobs;
