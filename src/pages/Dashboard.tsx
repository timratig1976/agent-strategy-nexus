
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Strategy, StrategyState } from "@/types/marketing";
import { PlusCircle, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const stateLabels: Record<StrategyState, string> = {
  briefing: "Briefing",
  persona: "Persona Development",
  pain_gains: "Pain & Gains",
  funnel: "Funnel Strategy",
  ads: "Ad Campaign"
};

const stateColors: Record<StrategyState, string> = {
  briefing: "bg-blue-100 text-blue-800",
  persona: "bg-purple-100 text-purple-800",
  pain_gains: "bg-amber-100 text-amber-800",
  funnel: "bg-green-100 text-green-800",
  ads: "bg-pink-100 text-pink-800"
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

  // Calculate progress percentage for a strategy based on completed tasks
  const calculateProgress = (strategy: Strategy): number => {
    if (strategy.tasks.length === 0) return 0;
    const completedTasks = strategy.tasks.filter(task => task.isCompleted).length;
    return Math.round((completedTasks / strategy.tasks.length) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Marketing Strategies</h1>
        <Link to="/create-strategy">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Strategy
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[260px] animate-pulse">
              <CardHeader className="bg-gray-100 dark:bg-gray-800 h-[60px]"></CardHeader>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-full mt-4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : strategies.length === 0 ? (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center h-60">
            <p className="text-xl text-gray-500 mb-4">No marketing strategies yet</p>
            <Link to="/create-strategy">
              <Button>Create Your First Strategy</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <Link to={`/strategy/${strategy.id}`} key={strategy.id}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="mr-2">{strategy.name}</CardTitle>
                    <Badge className={stateColors[strategy.state]}>
                      {stateLabels[strategy.state]}
                    </Badge>
                  </div>
                  <CardDescription>
                    {new Date(strategy.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium
                      ${strategy.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        strategy.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {strategy.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{strategy.description}</p>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{calculateProgress(strategy)}%</span>
                    </div>
                    <Progress value={calculateProgress(strategy)} className="h-2" />
                    
                    <div className="flex justify-end mt-4">
                      <span className="text-xs text-muted-foreground flex items-center">
                        View Details <ArrowRight className="ml-1 h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
