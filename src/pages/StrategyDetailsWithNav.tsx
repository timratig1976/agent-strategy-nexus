
import React, { useEffect } from "react";
import NavBar from "@/components/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StrategyTask, Strategy, AgentResult } from "@/types/marketing";
import StrategyTaskList from "@/components/StrategyTaskList";
import CompanyLogo from "@/components/CompanyLogo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AgentResultDisplay } from "@/components/agents/AgentResultDisplay";
import { toast } from "sonner";

const StrategyDetailsWithNav = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Redirect to dashboard if no ID is provided
  useEffect(() => {
    if (!id) {
      toast.error("Strategy ID is missing");
      navigate('/dashboard');
    }
  }, [id, navigate]);
  
  // Fetch strategy details
  const { data: strategy, isLoading: isStrategyLoading } = useQuery({
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
  const { data: agentResults, isLoading: isResultsLoading } = useQuery({
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
        return data;
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

  // Get the state label
  const getStateLabel = (state: string) => {
    const stateLabels: Record<string, string> = {
      briefing: "Briefing",
      persona: "Persona Development",
      pain_gains: "Pain & Gains",
      funnel: "Funnel Strategy",
      ads: "Ad Campaign"
    };
    return stateLabels[state] || state;
  };
  
  // Get the state color
  const getStateColor = (state: string) => {
    const stateColors: Record<string, string> = {
      briefing: "bg-blue-100 text-blue-800",
      persona: "bg-purple-100 text-purple-800",
      pain_gains: "bg-amber-100 text-amber-800",
      funnel: "bg-green-100 text-green-800",
      ads: "bg-pink-100 text-pink-800"
    };
    return stateColors[state] || "bg-gray-100 text-gray-800";
  };
  
  // If there's no ID, show a loading state until the redirect happens
  if (!id) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      </>
    );
  }
  
  if (isStrategyLoading || isTasksLoading) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </>
    );
  }
  
  if (!strategy) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Strategy not found</h1>
            <p>The strategy you're looking for doesn't exist or has been removed.</p>
            <Button 
              variant="default"
              className="mt-4" 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <CompanyLogo size="md" />
            <h1 className="text-3xl font-bold">{strategy.name}</h1>
            <Badge className={getStateColor(strategy.state)}>
              {getStateLabel(strategy.state)}
            </Badge>
          </div>
          
          <p className="text-gray-700">{strategy.description}</p>
        </div>
        
        <Tabs defaultValue="tasks">
          <TabsList className="mb-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {['briefing', 'persona', 'pain_gains', 'funnel', 'ads'].map((state) => (
                <StrategyTaskList
                  key={state}
                  strategyId={id}
                  tasks={tasks || []}
                  state={state as any}
                  onTasksChange={handleTasksChange}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <div className="space-y-6">
              {agentResults && agentResults.length > 0 ? (
                agentResults.map((result) => (
                  <Card key={result.id} className="mb-6">
                    <CardHeader>
                      <CardTitle>{result.agent_id ? "Agent Result" : "Strategy Result"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: result.content.replace(/\n/g, '<br>') }} />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Results Yet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Complete tasks to generate marketing strategy results.</p>
                  </CardContent>
                </Card>
              )}
              
              {/* Display the most recent agent result from AgentResultDisplay */}
              <AgentResultDisplay strategyId={id} agentId="" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StrategyDetailsWithNav;
