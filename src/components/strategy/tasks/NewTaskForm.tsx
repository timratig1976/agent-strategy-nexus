
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { StrategyState } from "@/types/marketing";

interface NewTaskFormProps {
  strategyId: string;
  state: StrategyState;  // Updated to explicitly use StrategyState
  onTaskAdded: () => void;
  onCancel?: () => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ 
  strategyId, 
  state,
  onTaskAdded, 
  onCancel 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Ensure state is properly typed as StrategyState
      const newTask = {
        id: uuidv4(),
        strategy_id: strategyId,
        title: title.trim(),
        description: description.trim(),
        state: state as StrategyState, // Explicitly cast to ensure correct type
        is_completed: false,
      };
      
      const { error } = await supabase
        .from('strategy_tasks')
        .insert(newTask);
      
      if (error) throw error;
      
      toast.success("Task added successfully");
      setTitle('');
      setDescription('');
      onTaskAdded();
    } catch (err) {
      console.error("Error adding task:", err);
      toast.error("Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-medium">Add New Task</h3>
      
      <div>
        <Input 
          placeholder="Task title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />
      </div>
      
      <div>
        <Textarea 
          placeholder="Task description (optional)" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        
        <Button 
          type="submit" 
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </Button>
      </div>
    </form>
  );
};

export default NewTaskForm;
