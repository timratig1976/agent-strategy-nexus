
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAgentGeneration } from "@/hooks/useAgentGeneration";
import useUspCanvasData from "./useUspCanvasData";
import { PainStatement, GainStatement } from "../types";

interface StatementsGenerationResult {
  painStatements: PainStatement[];
  gainStatements: GainStatement[];
  rawOutput?: string;
}

const useStatementsGenerator = (strategyId: string) => {
  const [generatedStatements, setGeneratedStatements] = useState<StatementsGenerationResult | null>(null);
  const { uspCanvasData, isLoading: isLoadingCanvasData } = useUspCanvasData(strategyId);
  
  // Use the agent generation hook
  const {
    isGenerating,
    progress,
    error,
    generateContent
  } = useAgentGeneration({
    strategyId,
    module: 'statements'
  });
  
  // Check if we have USP Canvas data on mount
  useEffect(() => {
    if (uspCanvasData && Object.keys(uspCanvasData).length === 0) {
      console.warn("No USP Canvas data found for strategy:", strategyId);
    }
  }, [uspCanvasData, strategyId]);
  
  // Generate statements
  const generateStatements = useCallback(async (customPrompt: string = '') => {
    if (!strategyId) {
      toast.error("Strategy ID is missing");
      return { painStatements: [], gainStatements: [] };
    }
    
    try {
      if (isLoadingCanvasData) {
        toast.error("Canvas data is still loading");
        return { painStatements: [], gainStatements: [] };
      }
      
      if (!uspCanvasData) {
        toast.error("No USP Canvas data available. Please complete the USP Canvas first.");
        return { painStatements: [], gainStatements: [] };
      }
      
      // Call AI to generate statements with custom prompt if provided
      const result = await generateContent<StatementsGenerationResult>({
        uspData: uspCanvasData,
        customPrompt: customPrompt || undefined,
        minStatements: 10 // Ensure at least 10 statements of each type
      });
      
      if (result.error) {
        toast.error(`Failed to generate statements: ${result.error}`);
        return { painStatements: [], gainStatements: [] };
      }
      
      if (!result.data) {
        toast.error("No statements were generated");
        return { painStatements: [], gainStatements: [] };
      }
      
      // Store the generated statements
      setGeneratedStatements(result.data);
      toast.success("Statements generated successfully");
      
      return result.data;
      
    } catch (error: any) {
      console.error("Error generating statements:", error);
      toast.error(error.message || "Failed to generate statements");
      return { painStatements: [], gainStatements: [] };
    }
  }, [strategyId, uspCanvasData, isLoadingCanvasData, generateContent]);
  
  return {
    generateStatements,
    generatedStatements,
    isGenerating,
    progress,
    error,
    isLoadingCanvasData,
    uspCanvasData
  };
};

export default useStatementsGenerator;
