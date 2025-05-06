
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
        
        // Map to our Strategy type
        return {
          id: data.id,
          name: data.name,
          description: data.description || '',
          status: data.status,
          state: data.state,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          userId: data.user_id,
          agents: [],
          results: [],
          tasks: []
        } as Strategy;
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
        
        // Map to our AgentResult type
        return data.map(result => ({
          id: result.id,
          agentId: result.agent_id,
          strategyId: result.strategy_id,
          content: result.content,
          createdAt: result.created_at,
          metadata: result.metadata
        })) as AgentResult[];
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
