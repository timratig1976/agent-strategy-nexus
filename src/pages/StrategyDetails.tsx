
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";

// Import refactored components
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyHeader from "@/components/strategy/StrategyHeader";
import LoadingStrategy from "@/components/strategy/loading/LoadingStrategy";
import StrategyNotFound from "@/components/strategy/StrategyNotFound";
import StrategyBriefing from "@/components/strategy/briefing";

// Import custom hooks and utilities
import useStrategyData from "@/hooks/useStrategyData";
import { getStateLabel, getStateColor } from "@/utils/strategyUtils";

const StrategyDetails = () => {
  // Extract the id parameter from the URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Redirect to dashboard if no ID is provided
  useEffect(() => {
    if (!id) {
      toast.error("Strategy ID is missing");
      navigate('/dashboard');
      return;
    }
  }, [id, navigate, searchParams]);
  
  // Use the custom hook to fetch all strategy data
  const { 
    strategy, 
    agentResults, 
    isLoading
  } = useStrategyData({ id });
  
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
  
  if (isLoading) {
    return <LoadingStrategy />;
  }
  
  if (!strategy) {
    return <StrategyNotFound />;
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <StrategyBackButton />
          
          <StrategyHeader 
            strategy={strategy}
            getStateLabel={getStateLabel}
            getStateColor={getStateColor}
          />
          
          <p className="text-gray-700">{strategy.description}</p>
        </div>
        
        <StrategyBriefing 
          strategy={strategy} 
          agentResults={agentResults || []} 
        />
      </div>
    </>
  );
};

export default StrategyDetails;
