import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Strategy, StrategyState } from "@/types/marketing";
import { useAuth } from "@/context/AuthProvider";
import NavBar from "@/components/NavBar";
import { 
  DashboardHeader,
  StrategyList,
  StrategySkeleton
} from "@/components/dashboard";

const stateLabels: Record<string, string> = {
  [StrategyState.BRIEFING]: "Briefing",
  [StrategyState.PERSONA]: "Persona Development",
  [StrategyState.PAIN_GAINS]: "Pain & Gains",
  [StrategyState.FUNNEL]: "Funnel Strategy",
  [StrategyState.ADS]: "Ad Campaign",
  [StrategyState.COMPLETED]: "Completed"
};

const stateColors: Record<string, string> = {
  [StrategyState.BRIEFING]: "bg-blue-100 text-blue-800",
  [StrategyState.PERSONA]: "bg-purple-100 text-purple-800",
  [StrategyState.PAIN_GAINS]: "bg-amber-100 text-amber-800",
  [StrategyState.FUNNEL]: "bg-green-100 text-green-800",
  [StrategyState.ADS]: "bg-pink-100 text-pink-800",
  [StrategyState.COMPLETED]: "bg-gray-100 text-gray-800"
};

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStrategies = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch strategies
        const { data: strategyData, error: strategyError } = await supabase
          .from('strategies')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (strategyError) {
          throw strategyError;
        }

        // Fetch tasks for all strategies
        const strategyIds = strategyData.map(s => s.id);
        let tasksData: any[] = [];
        
        if (strategyIds.length > 0) {
          const { data: fetchedTasks, error: tasksError } = await supabase
            .from('strategy_tasks')
            .select('*')
            .in('strategy_id', strategyIds);
            
          if (tasksError) {
            throw tasksError;
          }
          
          tasksData = fetchedTasks || [];
        }

        // Transform the data to match our Strategy interface
        const transformedStrategies: Strategy[] = (strategyData || []).map(item => {
          const strategyTasks = tasksData.filter(task => task.strategy_id === item.id).map(task => ({
            id: task.id,
            strategyId: task.strategy_id,
            title: task.title,
            description: task.description || '',
            state: task.state,
            isCompleted: task.is_completed,
            createdAt: task.created_at,
            updatedAt: task.updated_at
          }));
          
          return {
            id: item.id,
            name: item.name,
            description: item.description || '',
            status: item.status,
            state: item.state,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            userId: item.user_id,
            agents: [],
            results: [],
            tasks: strategyTasks
          };
        });

        setStrategies(transformedStrategies);
      } catch (error) {
        console.error('Error fetching strategies:', error);
        toast({
          title: "Error",
          description: "Failed to load marketing strategies",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, [toast, user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      <DashboardHeader />
      
      {loading ? (
        <StrategySkeleton />
      ) : (
        <StrategyList 
          strategies={strategies}
          stateLabels={stateLabels}
          stateColors={stateColors}
        />
      )}
    </div>
  );
};

export default Dashboard;
