
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Strategy, Agent, AgentResult, StrategyTask, StrategyState } from "@/types/marketing";
import { ArrowLeft, Play, RefreshCw, Save, ArrowRightCircle, CheckCircle2 } from "lucide-react";
import StrategyTaskList from "@/components/StrategyTaskList";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const stateOrder: StrategyState[] = ['briefing', 'persona', 'pain_gains', 'funnel', 'ads'];

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

const StrategyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [agentInput, setAgentInput] = useState<Record<string, string>>({});
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Check if all tasks in the current state are completed
  const canProgressToNextState = (strategy: Strategy | null): boolean => {
    if (!strategy) return false;
    
    const currentStateIndex = stateOrder.indexOf(strategy.state);
    if (currentStateIndex >= stateOrder.length - 1) return false; // Already at the last state
    
    const currentStateTasks = strategy.tasks.filter(task => task.state === strategy.state);
    return currentStateTasks.length > 0 && currentStateTasks.every(task => task.isCompleted);
  };

  // Get the next state in the progression
  const getNextState = (currentState: StrategyState): StrategyState | null => {
    const currentIndex = stateOrder.indexOf(currentState);
    return currentIndex < stateOrder.length - 1 ? stateOrder[currentIndex + 1] : null;
  };

  useEffect(() => {
    if (!id || !user) return;

    const fetchStrategy = async () => {
      try {
        // Fetch strategy details
        const { data: strategyData, error: strategyError } = await supabase
          .from('strategies')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (strategyError) throw strategyError;
        
        // Fetch agents for this strategy
        const { data: agentsData, error: agentsError } = await supabase
          .from('agents')
          .select('*')
          .eq('strategy_id', id);
        
        if (agentsError) throw agentsError;
        
        // Fetch results for this strategy
        const { data: resultsData, error: resultsError } = await supabase
          .from('agent_results')
          .select('*')
          .eq('strategy_id', id);
        
        if (resultsError) throw resultsError;
        
        // Fetch tasks for this strategy
        const { data: tasksData, error: tasksError } = await supabase
          .from('strategy_tasks')
          .select('*')
          .eq('strategy_id', id);
        
        if (tasksError) throw tasksError;
        
        // Transform the data to match our interfaces
        const transformedAgents: Agent[] = agentsData?.map((agent) => ({
          id: agent.id,
          name: agent.name,
          type: agent.type,
          description: agent.description || '',
          isActive: agent.is_active
        })) || [];

        const transformedResults: AgentResult[] = resultsData?.map((result) => ({
          id: result.id,
          agentId: result.agent_id || '',
          strategyId: result.strategy_id || '',
          content: result.content,
          createdAt: result.created_at,
          metadata: result.metadata as Record<string, any> || {}
        })) || [];
        
        const transformedTasks: StrategyTask[] = tasksData?.map((task) => ({
          id: task.id,
          strategyId: task.strategy_id,
          title: task.title,
          description: task.description || '',
          state: task.state,
          isCompleted: task.is_completed,
          createdAt: task.created_at,
          updatedAt: task.updated_at
        })) || [];

        // Combine all data
        setStrategy({
          id: strategyData.id,
          name: strategyData.name,
          description: strategyData.description || '',
          status: strategyData.status,
          state: strategyData.state,
          createdAt: strategyData.created_at,
          updatedAt: strategyData.updated_at,
          userId: strategyData.user_id,
          agents: transformedAgents,
          results: transformedResults,
          tasks: transformedTasks
        });

        // Initialize agent input state
        const initialInputs: Record<string, string> = {};
        transformedAgents.forEach((agent) => {
          initialInputs[agent.id] = '';
        });
        setAgentInput(initialInputs);
        
        // Set the first agent as the current tab if available
        if (transformedAgents && transformedAgents.length > 0) {
          setCurrentTab(transformedAgents[0].id);
        }
      } catch (error) {
        console.error('Error fetching strategy:', error);
        toast({
          title: "Error",
          description: "Failed to load strategy details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStrategy();
  }, [id, toast, user]);

  const runAgent = async (agentId: string) => {
    if (!strategy) return;
    
    const agent = strategy.agents.find(a => a.id === agentId);
    if (!agent) return;
    
    setRunningAgent(agentId);
    
    try {
      // This is where you would call your backend function to run the agent
      // For now, we'll simulate a response
      const simulatedResult = `Sample output for ${agent.name}.\n\nThis is a placeholder for the actual agent output. In a real application, this would be generated by calling a backend function that runs the specific agent with the provided input and context from other agents' results.`;
      
      // Save the result to the database
      const { data, error } = await supabase
        .from('agent_results')
        .insert({
          agent_id: agentId,
          strategy_id: strategy.id,
          content: simulatedResult,
          created_at: new Date().toISOString(),
          metadata: { input: agentInput[agentId] } as Record<string, any>
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Transform the new result to match our interface
      const newResult: AgentResult = {
        id: data.id,
        agentId: data.agent_id || '',
        strategyId: data.strategy_id || '',
        content: data.content,
        createdAt: data.created_at,
        metadata: data.metadata as Record<string, any> || {}
      };
      
      // Update the strategy state with the new result
      setStrategy(prev => {
        if (!prev) return null;
        return {
          ...prev,
          results: [...prev.results, newResult]
        };
      });
      
      toast({
        title: "Success",
        description: `${agent.name} completed successfully!`,
      });
    } catch (error) {
      console.error('Error running agent:', error);
      toast({
        title: "Error",
        description: `Failed to run ${agent.name}`,
        variant: "destructive",
      });
    } finally {
      setRunningAgent(null);
    }
  };

  const getAgentResult = (agentId: string) => {
    if (!strategy) return null;
    return strategy.results.find(r => r.agentId === agentId);
  };

  const handleUpdateTasks = (updatedTasks: StrategyTask[]) => {
    if (!strategy) return;
    setStrategy({ ...strategy, tasks: updatedTasks });
  };

  const progressToNextState = async () => {
    if (!strategy) return;
    
    const nextState = getNextState(strategy.state);
    if (!nextState) return;
    
    try {
      // Update the strategy state
      const { error: updateError } = await supabase
        .from('strategies')
        .update({ state: nextState, status: 'in_progress' })
        .eq('id', strategy.id);
      
      if (updateError) throw updateError;
      
      // Add the initial task for the next state if provided
      if (newTaskTitle.trim()) {
        const { error: taskError } = await supabase
          .from('strategy_tasks')
          .insert({
            strategy_id: strategy.id,
            title: newTaskTitle.trim(),
            state: nextState,
            is_completed: false
          });
        
        if (taskError) throw taskError;
      }
      
      // Refetch the strategy to get updated data
      const { data: updatedStrategy, error: fetchError } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', strategy.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Fetch updated tasks
      const { data: updatedTasks, error: tasksError } = await supabase
        .from('strategy_tasks')
        .select('*')
        .eq('strategy_id', strategy.id);
      
      if (tasksError) throw tasksError;
      
      const transformedTasks: StrategyTask[] = updatedTasks?.map((task) => ({
        id: task.id,
        strategyId: task.strategy_id,
        title: task.title,
        description: task.description || '',
        state: task.state,
        isCompleted: task.is_completed,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      })) || [];
      
      // Update local state
      setStrategy({
        ...strategy,
        state: updatedStrategy.state,
        status: updatedStrategy.status,
        tasks: transformedTasks
      });
      
      // Reset dialog state and close it
      setNewTaskTitle('');
      setIsProgressDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Progressed to ${stateLabels[nextState]} stage`
      });
    } catch (error) {
      console.error('Error updating strategy state:', error);
      toast({
        title: "Error",
        description: "Failed to progress to the next state",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-start">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <div className="h-[600px] flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-start">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        <Card className="w-full">
          <CardContent className="p-6 flex flex-col items-center justify-center h-[400px]">
            <p className="text-xl text-gray-500">Strategy not found</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-start">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{strategy.name}</h1>
            <Badge className={stateColors[strategy.state]}>
              {stateLabels[strategy.state]}
            </Badge>
          </div>
          <p className="text-gray-500 mt-1">{strategy.description}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Badge className={`
            ${strategy.status === 'completed' ? 'bg-green-100 text-green-800' : 
              strategy.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'}`}>
            {strategy.status.replace('_', ' ').toUpperCase()}
          </Badge>
          
          {canProgressToNextState(strategy) && (
            <Button 
              onClick={() => setIsProgressDialogOpen(true)}
              className="ml-2"
              size="sm"
            >
              Progress to Next Stage <ArrowRightCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Render task lists for current state */}
        <StrategyTaskList 
          strategyId={strategy.id}
          tasks={strategy.tasks}
          state={strategy.state}
          onTasksChange={handleUpdateTasks}
        />
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="w-full overflow-x-auto flex whitespace-nowrap">
          <TabsTrigger value="overview">Strategy Overview</TabsTrigger>
          {strategy.agents.map(agent => (
            <TabsTrigger key={agent.id} value={agent.id}>
              {agent.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Overview</CardTitle>
              <CardDescription>
                Combined results from all marketing agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {strategy.results.length > 0 ? (
                <div className="space-y-8">
                  {strategy.agents.map(agent => {
                    const result = getAgentResult(agent.id);
                    return result ? (
                      <div key={agent.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                        <h3 className="text-lg font-medium mb-2">{agent.name}</h3>
                        <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                          {result.content}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    No results yet. Run agents to generate marketing insights.
                  </p>
                  <Button onClick={() => setCurrentTab(strategy.agents[0]?.id)}>
                    Start with First Agent
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  // Here you would export the full strategy results
                  toast({
                    title: "Feature Coming Soon",
                    description: "Export functionality will be available soon"
                  });
                }}
              >
                Export Results
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {strategy.agents.map(agent => {
          const result = getAgentResult(agent.id);
          return (
            <TabsContent key={agent.id} value={agent.id} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{agent.name}</CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Agent Input</h3>
                    <Textarea 
                      placeholder={`Enter instructions for ${agent.name}...`}
                      value={agentInput[agent.id] || ''}
                      onChange={(e) => setAgentInput({...agentInput, [agent.id]: e.target.value})}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-gray-500">
                      Provide specific instructions for this agent. You can reference other agent results.
                    </p>
                  </div>
                  
                  {result && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Agent Result</h3>
                      <div className="whitespace-pre-wrap bg-muted p-4 rounded-md min-h-[200px]">
                        {result.content}
                      </div>
                      <p className="text-xs text-gray-500">
                        Generated on {new Date(result.createdAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                  <Button 
                    onClick={() => runAgent(agent.id)}
                    disabled={runningAgent !== null}
                  >
                    {runningAgent === agent.id ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        {result ? "Re-run Agent" : "Run Agent"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
      
      {/* Progress to Next State Dialog */}
      <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Progress to {getNextState(strategy.state) ? stateLabels[getNextState(strategy.state)!] : 'Next'} Stage</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">
              All tasks for the {stateLabels[strategy.state]} stage are complete.
              Are you ready to move to the next stage?
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-task">Create first task for the next stage (optional)</Label>
                <Input
                  id="new-task"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="E.g., Complete competitor analysis"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProgressDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={progressToNextState}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> 
              Progress to Next Stage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategyDetails;
