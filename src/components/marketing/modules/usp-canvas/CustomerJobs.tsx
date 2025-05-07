
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CustomerJob } from './types';
import { Trash2, Plus, ArrowUpDown, CheckSquare, Square } from "lucide-react";

interface CustomerJobsProps {
  jobs: CustomerJob[];
  onAdd: (content: string, priority: 'low' | 'medium' | 'high') => void;
  onUpdate: (id: string, content: string, priority: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
}

const CustomerJobs = ({ jobs, onAdd, onUpdate, onDelete }: CustomerJobsProps) => {
  const [newJobContent, setNewJobContent] = useState('');
  const [newJobPriority, setNewJobPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [sortOrder, setSortOrder] = useState<'default' | 'priority-high' | 'priority-low'>('default');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);

  const handleAddJob = () => {
    if (newJobContent.trim()) {
      onAdd(newJobContent.trim(), newJobPriority);
      setNewJobContent('');
      setNewJobPriority('medium');
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

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortOrder === 'default') return 0;
    const priorityA = priorityValue(a.priority);
    const priorityB = priorityValue(b.priority);
    return sortOrder === 'priority-high' 
      ? priorityB - priorityA 
      : priorityA - priorityB;
  });

  const handleSort = () => {
    if (sortOrder === 'default') setSortOrder('priority-high');
    else if (sortOrder === 'priority-high') setSortOrder('priority-low');
    else setSortOrder('default');
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-blue-800 mb-2">What are Customer Jobs?</h3>
        <p className="text-sm text-blue-700">
          Customer jobs describe what your customers are trying to get done in their work and lives. 
          These could be tasks they're trying to complete, problems they're trying to solve, or needs they're trying to satisfy.
        </p>
      </div>

      {sortedJobs.length > 0 && (
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSort}
            className="flex items-center space-x-1 text-sm"
          >
            <ArrowUpDown className="h-3 w-3" />
            <span>
              {sortOrder === 'default' ? 'Default Order' : 
               sortOrder === 'priority-high' ? 'Highest Priority First' : 
               'Lowest Priority First'}
            </span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSelectMode}
            className="text-sm"
          >
            {isSelectMode ? (
              <>Cancel Selection</>
            ) : (
              <>Select Multiple</>
            )}
          </Button>
        </div>
      )}

      {isSelectMode && selectedJobs.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
          <span className="text-sm">{selectedJobs.length} jobs selected</span>
          <Button 
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {sortedJobs.map((job) => (
          <div 
            key={job.id} 
            className={`p-4 bg-white border rounded-md ${
              isSelectMode && selectedJobs.includes(job.id) ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <div className="flex items-start space-x-3 mb-3">
              {isSelectMode && (
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
              )}
              <div className="flex-1">
                <Input 
                  value={job.content}
                  onChange={(e) => onUpdate(job.id, e.target.value, job.priority)}
                  placeholder="What is your customer trying to accomplish?"
                />
              </div>
              {!isSelectMode && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(job.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="mt-3">
              <Label className="text-sm font-medium mb-2">Priority Level:</Label>
              <RadioGroup 
                value={job.priority} 
                onValueChange={(value) => onUpdate(job.id, job.content, value as 'low' | 'medium' | 'high')}
                className="flex space-x-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id={`job-${job.id}-low`} />
                  <Label htmlFor={`job-${job.id}-low`} className="text-sm">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id={`job-${job.id}-medium`} />
                  <Label htmlFor={`job-${job.id}-medium`} className="text-sm">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id={`job-${job.id}-high`} />
                  <Label htmlFor={`job-${job.id}-high`} className="text-sm">High</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Priority indicator badge */}
            <div className="mt-2">
              <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                job.priority === 'high' ? 'bg-red-100 text-red-800' :
                job.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                'bg-green-100 text-green-800'
              }`}>
                {job.priority === 'high' ? 'High Priority' :
                 job.priority === 'medium' ? 'Medium Priority' :
                 'Low Priority'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border rounded-md space-y-4">
        <div>
          <Input 
            value={newJobContent}
            onChange={(e) => setNewJobContent(e.target.value)}
            placeholder="Add a new customer job..."
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2">Priority Level:</Label>
          <RadioGroup 
            value={newJobPriority} 
            onValueChange={(value) => setNewJobPriority(value as 'low' | 'medium' | 'high')}
            className="flex space-x-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="new-job-low" />
              <Label htmlFor="new-job-low" className="text-sm">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="new-job-medium" />
              <Label htmlFor="new-job-medium" className="text-sm">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="new-job-high" />
              <Label htmlFor="new-job-high" className="text-sm">High</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="text-right">
          <Button 
            onClick={handleAddJob}
            disabled={!newJobContent.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerJobs;
