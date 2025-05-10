
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StrategyTask } from "@/types/marketing";

export const useTaskOperations = (
  tasks: StrategyTask[], 
  onTasksChange: (tasks: StrategyTask[]) => void
) => {
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  
  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('strategy_tasks')
        .update({ is_completed: isCompleted })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update local state
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, isCompleted } : task
      );
      
      onTasksChange(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('strategy_tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update local state
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      onTasksChange(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };
  
  const handleTaskAdded = (newTask: StrategyTask) => {
    onTasksChange([...tasks, newTask]);
  };
  
  return {
    isAdding,
    setIsAdding,
    handleToggleTask,
    handleDeleteTask,
    handleTaskAdded
  };
};
