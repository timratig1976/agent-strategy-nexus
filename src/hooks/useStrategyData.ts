
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StrategyTask, AgentResult, Strategy } from "@/types/marketing";
import { toast } from "sonner";

interface UseStrategyDataProps {
  id?: string;
}

export interface StrategyMetadata {
  id: string;
  strategy_id: string;
  company_name: string | null;
  website_url: string | null;
  product_description: string | null;
  product_url: string | null;
  additional_info: string | null;
  created_at: string;
  updated_at: string;
}

export const useStrategyData = ({ id }: UseStrategyDataProps) => {
  // Fetch strategy details
  const { 
    data: strategy, 
    isLoading: isStrategyLoading,
    error: strategyError,
    refetch: refetchStrategy
  } = useQuery({
    queryKey: ['strategy', id],
    queryFn: async () => {
      if (!id) return null;
      
      try {
        console.log("Fetching strategy data for ID:", id);
        
        const { data, error } = await supabase
          .from('strategies')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Strategy fetch error:", error);
          throw error;
        }
        
        console.log("Strategy data retrieved:", data);
        
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
        // Only show error toast once, not on every retry
        toast.error("Failed to load strategy details", { id: 'strategy-error' });
        throw err; // Re-throw to let React Query handle it
      }
    },
    enabled: !!id, // Only run query if id is available
    retry: 2, // Retry up to 2 times on failure
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
  
  // Fetch tasks for this strategy
  const { 
    data: tasks, 
    isLoading: isTasksLoading,
    error: tasksError,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['strategy-tasks', id],
    queryFn: async () => {
      if (!id) return [];
      
      try {
        console.log("Fetching tasks for strategy ID:", id);
        
        const { data, error } = await supabase
          .from('strategy_tasks')
          .select('*')
          .eq('strategy_id', id)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error("Tasks fetch error:", error);
          throw error;
        }
        
        console.log("Tasks retrieved:", data?.length || 0);
        
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
        // Only show error toast once, not on every retry
        toast.error("Failed to load strategy tasks", { id: 'tasks-error' });
        return []; // Return empty array on error to prevent endless retry loops
      }
    },
    enabled: !!id && !!strategy, // Only run query if id is available and strategy loaded
    retry: 1 // Only retry once to prevent endless loops
  });
  
  // Fetch agent results for this strategy
  const { 
    data: agentResults, 
    isLoading: isResultsLoading,
    error: resultsError,
    refetch: refetchResults
  } = useQuery({
    queryKey: ['strategy-results', id],
    queryFn: async () => {
      if (!id) return [];
      
      try {
        console.log("Fetching agent results for strategy ID:", id);
        
        const { data, error } = await supabase
          .from('agent_results')
          .select('*')
          .eq('strategy_id', id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error("Agent results fetch error:", error);
          throw error;
        }
        
        console.log("Agent results retrieved:", data?.length || 0);
        
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
        // Only display toast once
        toast.error("Failed to load agent results", { id: 'results-error' });
        return []; // Return empty array on error to prevent endless retry loops
      }
    },
    enabled: !!id && !!strategy, // Only run query if id is available and strategy loaded
    retry: 1 // Only retry once to prevent endless loops
  });
  
  // Handle task changes
  const handleTasksChange = (updatedTasks: StrategyTask[]) => {
    refetchTasks();
  };

  // Function to refetch all data
  const refetch = () => {
    console.log("Refetching all strategy data");
    refetchStrategy();
    refetchTasks();
    refetchResults();
  };

  return {
    strategy,
    tasks,
    agentResults,
    isLoading: isStrategyLoading || isTasksLoading || isResultsLoading,
    isError: !!strategyError || !!tasksError || !!resultsError,
    handleTasksChange,
    refetch
  };
};

export default useStrategyData;
