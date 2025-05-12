
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Strategy, StrategyState } from "@/types/marketing";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";
import { useStatementsData } from "./hooks/useStatementsData";
import useStatementsGenerator from "./hooks/useStatementsGenerator";
import StatementsAIGenerator from "./components/StatementsAIGenerator";
import StatementsTabPanel from "./components/StatementsTabPanel";
import StatementsLoading from "./components/StatementsLoading";

interface StatementsModuleProps {
  strategy: Strategy;
}

const StatementsModule: React.FC<StatementsModuleProps> = ({ strategy }) => {
  const { id } = useParams<{ id: string }>();
  const { navigateToPreviousStep, navigateToNextStep, isNavigating } = useStrategyNavigation({
    strategyId: strategy.id,
  });
  
  // Use statements data hook
  const {
    painStatements,
    gainStatements,
    addPainStatement,
    addGainStatement,
    deletePainStatement,
    deleteGainStatement,
    saveStatements,
    isLoading
  } = useStatementsData({ strategyId: strategy.id });
  
  // AI Generator integration
  const {
    generateStatements,
    isGenerating,
    progress
  } = useStatementsGenerator(strategy.id);
  
  // Initialize activeTab state
  const [activeTab, setActiveTab] = useState('pain');
  
  // Handle navigation with auto-save
  const handleNavigate = async (direction: 'next' | 'previous') => {
    try {
      // Save statements before navigating
      await saveStatements();
      
      if (direction === 'next') {
        navigateToNextStep(StrategyState.STATEMENTS);
      } else {
        navigateToPreviousStep(StrategyState.STATEMENTS);
      }
    } catch (error) {
      console.error("Error saving statements:", error);
      toast.error("Failed to save statements before navigation");
    }
  };
  
  // Generate statements with AI
  const handleGenerateStatements = async () => {
    try {
      const result = await generateStatements();
      return result;
    } catch (error) {
      console.error("Error generating statements:", error);
      return { painStatements: [], gainStatements: [] };
    }
  };
  
  // Add AI-generated statements
  const handleAddStatements = (painStatements: any[], gainStatements: any[]) => {
    // Add pain statements
    painStatements.forEach(statement => {
      addPainStatement(statement.content, statement.impact, true);
    });
    
    // Add gain statements
    gainStatements.forEach(statement => {
      addGainStatement(statement.content, statement.impact, true);
    });
    
    // Save statements
    saveStatements().catch(error => {
      console.error("Error saving statements:", error);
      toast.error("Failed to save statements");
    });
  };
  
  // Auto-save when component unmounts
  useEffect(() => {
    return () => {
      // Don't await here, just fire and forget
      saveStatements().catch(console.error);
    };
  }, [saveStatements]);
  
  // Show loading state
  if (isLoading) {
    return <StatementsLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Pain & Gain Statements</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleNavigate('previous')}
            disabled={isNavigating}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to USP Canvas
          </Button>
          <Button 
            onClick={() => handleNavigate('next')}
            disabled={isNavigating}
            className="flex items-center gap-2"
          >
            Continue to Funnel Strategy
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* AI Generator Section */}
            <StatementsAIGenerator
              onGenerate={handleGenerateStatements}
              onAddStatements={handleAddStatements}
              isGenerating={isGenerating}
              progress={progress}
            />
            
            {/* Statements Tabs */}
            <StatementsTabPanel
              painStatements={painStatements}
              gainStatements={gainStatements}
              addPainStatement={addPainStatement}
              addGainStatement={addGainStatement}
              deletePainStatement={deletePainStatement}
              deleteGainStatement={deleteGainStatement}
              initialActiveTab={activeTab}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatementsModule;
