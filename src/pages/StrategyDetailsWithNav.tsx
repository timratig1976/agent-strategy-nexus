import React, { useEffect } from "react";
import NavBar from "@/components/NavBar";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Import refactored components
import StrategyBackButton from "@/components/strategy/StrategyBackButton";
import StrategyHeader from "@/components/strategy/StrategyHeader";
import StrategyTasksGrid from "@/components/strategy/StrategyTasksGrid";
import StrategyResults from "@/components/strategy/StrategyResults";
import LoadingStrategy from "@/components/strategy/loading/LoadingStrategy";
import StrategyNotFound from "@/components/strategy/StrategyNotFound";

// Import custom hooks and utilities
import useStrategyData from "@/hooks/useStrategyData";
import { getStateLabel, getStateColor } from "@/utils/strategyUtils";

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
  
  // Use the custom hook to fetch all strategy data
  const { 
    strategy, 
    tasks, 
    agentResults, 
    isLoading, 
    handleTasksChange 
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
          
          {/* Description removed from here */}
        </div>
        
        <Tabs defaultValue="tasks">
          <TabsList className="mb-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks">
            <StrategyTasksGrid 
              strategyId={id}
              tasks={tasks || []}
              onTasksChange={handleTasksChange}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <StrategyResults 
              strategyId={id}
              agentResults={agentResults}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default StrategyDetailsWithNav;
