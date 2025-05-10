
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import StrategyBoard from '@/components/strategy/visualization/StrategyBoard';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { AgentResult, StrategyState } from "@/types/marketing";

const StrategyBoardPage = () => {
  const { strategyId } = useParams<{ strategyId: string }>();
  const navigate = useNavigate();
  const [agentResults, setAgentResults] = useState<AgentResult[]>([]);
  const [currentStage, setCurrentStage] = useState<StrategyState | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (strategyId) {
      fetchStrategyData();
    }
  }, [strategyId]);
  
  const fetchStrategyData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch the strategy details
      const { data: strategy, error: strategyError } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', strategyId)
        .single();
      
      if (strategyError) throw strategyError;
      
      if (strategy) {
        setCurrentStage(strategy.state as StrategyState);
      }
      
      // Fetch all agent results for this strategy
      const { data: results, error: resultsError } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId);
      
      if (resultsError) throw resultsError;
      
      if (results) {
        // Map the database results to the AgentResult type
        const mappedResults: AgentResult[] = results.map(result => ({
          id: result.id,
          agentId: result.agent_id || "",
          strategyId: result.strategy_id,
          content: result.content,
          createdAt: result.created_at,
          metadata: result.metadata ? { ...result.metadata as Record<string, any> } : {}
        }));
        
        setAgentResults(mappedResults);
      }
      
    } catch (error) {
      console.error('Error fetching strategy data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
          onClick={() => navigate(`/strategy-details/${strategyId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Strategy</span>
        </Button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Strategy Visualization Board</h1>
        <p className="text-muted-foreground mt-1">
          An interactive visualization of your marketing strategy and results.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <StrategyBoard 
          strategyId={strategyId || ""} 
          agentResults={agentResults}
          currentStage={currentStage}
        />
      )}
    </div>
  );
};

export default StrategyBoardPage;
