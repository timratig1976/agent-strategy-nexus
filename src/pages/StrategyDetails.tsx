
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StrategyTask } from "@/types/marketing";
import StrategyTaskList from "@/components/StrategyTaskList";

// This component is now being used through StrategyDetailsWithNav.tsx
const StrategyDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch strategy details
  const { data: strategy, isLoading: isStrategyLoading } = useQuery({
    queryKey: ['strategy', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch tasks for this strategy
  const { 
    data: tasks, 
    isLoading: isTasksLoading,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['strategy-tasks', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategy_tasks')
        .select('*')
        .eq('strategy_id', id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Map to our StrategyTask type
      return data.map(task => ({
        id: task.id,
        strategyId: task.strategy_id,
        title: task.title,
        description: task.description || '',
        state: task.state,
        isCompleted: task.is_completed,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      })) as StrategyTask[];
    }
  });
  
  // Handle task changes
  const handleTasksChange = (updatedTasks: StrategyTask[]) => {
    refetchTasks();
  };
  
  if (isStrategyLoading || isTasksLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }
  
  if (!strategy) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Strategy not found</h1>
          <p>The strategy you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{strategy.name}</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{strategy.description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {['briefing', 'persona', 'pain_gains', 'funnel', 'ads'].map((state) => (
          <StrategyTaskList
            key={state}
            strategyId={id || ''}
            tasks={tasks || []}
            state={state as any}
            onTasksChange={handleTasksChange}
          />
        ))}
      </div>
    </div>
  );
};

export default StrategyDetails;
