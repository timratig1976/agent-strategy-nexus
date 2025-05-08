
import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";

// Import refactored components
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyHeader from "@/components/strategy/StrategyHeader";
import LoadingStrategy from "@/components/strategy/loading/LoadingStrategy";
import StrategyNotFound from "@/components/strategy/StrategyNotFound";
import StrategyBriefing from "@/components/strategy/briefing";
import { PersonaDevelopment } from "@/components/strategy/personas";
import PainGainsModule from "@/components/strategy/pain-gains";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import custom hooks and utilities
import useStrategyData from "@/hooks/useStrategyData";
import { getStateLabel, getStateColor } from "@/utils/strategyUtils";
import { supabase } from "@/integrations/supabase/client";

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
    isLoading,
    refetch 
  } = useStrategyData({ id });

  // Refresh the data when the component mounts or when the URL changes
  useEffect(() => {
    if (id) {
      console.log("Refreshing strategy data for ID:", id);
      refetch();
    }
  }, [id, refetch]);
  
  // Handler for going back from funnel to pain_gains (USP Canvas)
  const handleGoToPreviousStep = async (currentState: string) => {
    if (!id) return;
    
    try {
      let previousState = 'briefing'; // Default
      
      // Determine the previous state based on the current state
      if (currentState === 'funnel') {
        previousState = 'pain_gains';
      } else if (currentState === 'pain_gains') {
        previousState = 'persona';
      } else if (currentState === 'persona') {
        previousState = 'briefing';
      }
      
      console.log(`Going back from ${currentState} to ${previousState}`);
      
      // Update the strategy state
      const { error } = await supabase
        .from('strategies')
        .update({ state: previousState })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error(`Failed to go back to ${previousState} stage`);
        return;
      }
      
      toast.success(`Returned to ${getStateLabel(previousState)} stage`);
      refetch(); // Refresh the data
      
    } catch (err) {
      console.error("Failed to go back to previous step:", err);
      toast.error("Failed to navigate back");
    }
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
  
  if (isLoading) {
    return <LoadingStrategy />;
  }
  
  if (!strategy) {
    return <StrategyNotFound />;
  }

  // Determine the final briefing result to pass to other pages
  const finalBriefing = agentResults?.find(result => 
    result.metadata?.is_final === true && (!result.metadata?.type || result.metadata?.type === 'briefing')
  ) || null;
  
  // Determine the final persona result to pass to pain_gains page
  const finalPersona = agentResults?.find(result =>
    result.metadata?.is_final === true && result.metadata?.type === 'persona'
  ) || null;

  console.log("Current strategy state:", strategy.state);
  console.log("Final briefing found:", !!finalBriefing);
  console.log("Final persona found:", !!finalPersona);

  // Determine which component to render based on the strategy state
  let contentComponent;
  if (strategy.state === 'briefing') {
    contentComponent = (
      <StrategyBriefing 
        strategy={strategy} 
        agentResults={agentResults || []} 
      />
    );
  } else if (strategy.state === 'persona') {
    contentComponent = (
      <PersonaDevelopment 
        strategy={strategy}
        agentResults={agentResults || []}
        briefingAgentResult={finalBriefing}
      />
    );
  } else if (strategy.state === 'pain_gains') {
    contentComponent = (
      <PainGainsModule 
        strategy={strategy}
        agentResults={agentResults || []}
        briefingAgentResult={finalBriefing}
        personaAgentResult={finalPersona}
      />
    );
  } else if (strategy.state === 'funnel') {
    // Add a simple Funnel stage UI with back navigation
    contentComponent = (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Funnel Strategy</h2>
          <Button 
            variant="outline" 
            onClick={() => handleGoToPreviousStep('funnel')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to USP Canvas
          </Button>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-lg font-medium text-blue-800">Funnel Strategy Development</h3>
          <p className="text-blue-700 mt-2">
            This is where you'll develop your marketing funnel strategy based on your USP canvas and personas.
          </p>
        </div>
      </div>
    );
  } else if (strategy.state === 'ads') {
    // Add a simple Ads stage UI with back navigation
    contentComponent = (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Ad Campaign Strategy</h2>
          <Button 
            variant="outline" 
            onClick={() => handleGoToPreviousStep('ads')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Funnel Strategy
          </Button>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
          <h3 className="text-lg font-medium text-purple-800">Ad Campaign Development</h3>
          <p className="text-purple-700 mt-2">
            This is where you'll develop your ad campaigns based on your marketing funnel strategy.
          </p>
        </div>
      </div>
    );
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
        
        {contentComponent}
      </div>
    </>
  );
};

export default StrategyDetails;
