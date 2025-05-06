
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StrategyTask, AgentResult, Strategy } from "@/types/marketing";
import { toast } from "sonner";

interface UseStrategyDataProps {
  id?: string;
}

export const useStrategyData = ({ id }: UseStrategyDataProps) => {
  // Fetch strategy details
  const { 
    data: strategy, 
    isLoading: isStrategyLoading 
  } = useQuery({
    queryKey: ['strategy', id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        const { data, error } = await supabase
          .from('strategies')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Error fetching strategy:", err);
        toast.error("Failed to load strategy details");
        return null;
      }
    },
    enabled: !!id // Only run query if id is available
  });
  
  // Fetch tasks for this strategy
  const { 
    data: tasks, 
    isLoading: isTasksLoading,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['strategy-tasks', id],
    queryFn: async () => {
      if (!id) return [];
      
      try {
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
      } catch (err) {
        console.error("Error fetching tasks:", err);
        toast.error("Failed to load strategy tasks");
        return [];
      }
    },
    enabled: !!id // Only run query if id is available
  });
  
  // Fetch agent results for this strategy
  const { 
    data: agentResults, 
    isLoading: isResultsLoading 
  } = useQuery({
    queryKey: ['strategy-results', id],
    queryFn: async () => {
      if (!id) return [];
      
      try {
        const { data, error } = await supabase
          .from('agent_results')
          .select('*')
          .eq('strategy_id', id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as AgentResult[];
      } catch (err) {
        console.error("Error fetching agent results:", err);
        return [];
      }
    },
    enabled: !!id // Only run query if id is available
  });
  
  // Handle task changes
  const handleTasksChange = (updatedTasks: StrategyTask[]) => {
    refetchTasks();
  };

  return {
    strategy,
    tasks,
    agentResults,
    isLoading: isStrategyLoading || isTasksLoading || isResultsLoading,
    handleTasksChange
  };
};

export default useStrategyData;
