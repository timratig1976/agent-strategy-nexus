
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NewTaskFormProps, StrategyTask } from "./types";

const NewTaskForm: React.FC<NewTaskFormProps> = ({ 
  strategyId, 
  state, 
  onTaskAdded, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    
    try {
      const newTask = {
        strategy_id: strategyId,
        title: newTaskTitle.trim(),
        state: state,
        is_completed: false
      };
      
      const { data, error } = await supabase
        .from('strategy_tasks')
        .insert(newTask)
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Transform to our StrategyTask type
      const transformedTask: StrategyTask = {
        id: data.id,
        strategyId: data.strategy_id,
        title: data.title,
        description: data.description || '',
        state: data.state,
        isCompleted: data.is_completed,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      // Notify parent component
      onTaskAdded(transformedTask);
      
      // Reset form
      setNewTaskTitle('');
      onCancel();
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex items-center gap-2 mt-2">
      <Input 
        type="text"
        placeholder="Task title"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        className="flex-1"
        onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        autoFocus
      />
      <Button onClick={handleAddTask} size="sm">Add</Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default NewTaskForm;
