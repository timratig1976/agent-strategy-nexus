
import React from "react";
import { useParams } from "react-router-dom";
import NavBar from "@/components/NavBar";
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyBoard from "@/components/strategy/visualization/StrategyBoard";
import useStrategyData from "@/hooks/useStrategyData";

const StrategyBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const { 
    strategy, 
    agentResults, 
    isLoading
  } = useStrategyData({ id });

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <StrategyBackButton />
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Strategy Visualization Board</h1>
            {strategy && (
              <span className="text-lg text-muted-foreground">{strategy.name}</span>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-96">Loading...</div>
        ) : (
          <StrategyBoard 
            strategyId={id || ''} 
            agentResults={agentResults} 
          />
        )}
      </div>
    </>
  );
};

export default StrategyBoardPage;
