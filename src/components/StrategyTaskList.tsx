
import React, { useState } from 'react';
import { StrategyTask, StrategyState } from '@/types/marketing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface StrategyTaskListProps {
  strategyId: string;
  tasks: StrategyTask[];
  state: StrategyState;
  onTasksChange: (tasks: StrategyTask[]) => void;
}

const stateLabels: Record<StrategyState, string> = {
  briefing: "Briefing",
  persona: "Persona Development",
  pain_gains: "Pain & Gains",
  funnel: "Funnel Strategy",
  ads: "Ad Campaign"
};

const StrategyTaskList: React.FC<StrategyTaskListProps> = ({ 
  strategyId, 
  tasks, 
  state, 
  onTasksChange 
}) => {
  const { toast } = useToast();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const stateTasks = tasks.filter(task => task.state === state);
  
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
      
      // Update local state
      onTasksChange([...tasks, transformedTask]);
      
      // Reset form
      setNewTaskTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{stateLabels[state]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stateTasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={task.isCompleted}
                  onCheckedChange={(checked) => handleToggleTask(task.id, checked === true)} 
                  id={task.id}
                />
                <label 
                  htmlFor={task.id} 
                  className={`text-sm cursor-pointer ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}
                >
                  {task.title}
                </label>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleDeleteTask(task.id)}
                className="opacity-50 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {isAdding ? (
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
                onClick={() => {
                  setNewTaskTitle('');
                  setIsAdding(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="w-full justify-start text-muted-foreground"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add task
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyTaskList;
