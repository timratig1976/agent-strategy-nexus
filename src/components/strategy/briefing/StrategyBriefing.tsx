import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { StrategyBriefingProps } from "./types";

// Import components
import BriefingEditorPanel from "./components/briefing-result/BriefingEditorPanel";
import { BriefingHeader, BriefingLayout } from "./components";
import StrategyInfoCard from "./components/strategy-info/StrategyInfoCard";
import WebsiteCrawlerWrapper from "./WebsiteCrawlerWrapper";

// Import hooks
import { useBriefingGenerator } from "./hooks/useBriefingGenerator";
import { useStrategyMetadata } from "./hooks/useStrategyMetadata";
import { useAgentResultSaver } from "./hooks/useAgentResultSaver";
import { useBriefingEditor } from "./hooks/useBriefingEditor";
import { useBriefingViewer } from "./hooks/useBriefingViewer";

const StrategyBriefing: React.FC<StrategyBriefingProps> = ({ 
  strategy, 
  agentResults = [] 
}) => {
  const navigate = useNavigate();
  const [showCrawler, setShowCrawler] = useState<boolean>(false);
  const [crawlResults, setCrawlResults] = useState<any | null>(null);
  const [hasFinalBriefing, setHasFinalBriefing] = useState<boolean>(false);
  const [enhancementText, setEnhancementText] = useState<string>("");
  
  // Use our custom hook for form state management
  const { formValues, saveStrategyMetadata: saveMetadata } = useStrategyMetadata(strategy.id);
  
  // Use our custom hook for saving agent results
  const { saveAgentResult: saveAgentResultToDb } = useAgentResultSaver();
  
  // Use our custom hook for briefing generation
  const {
    isGenerating,
    progress,
    generateBriefing,
    briefingHistory,
    setBriefingHistory,
    aiDebugInfo,
    error
  } = useBriefingGenerator(strategy.id);

  // Use our custom hooks for the editor panel
  const {
    showPromptMonitor,
    enhancerExpanded,
    togglePromptMonitor,
    toggleEnhancerExpanded
  } = useBriefingViewer();
  
  // Check if there's a final briefing in the history
  useEffect(() => {
    console.log("Checking for final briefing in history:", briefingHistory);
    const finalBriefing = briefingHistory.find(briefing => 
      briefing.metadata && briefing.metadata.is_final === true
    );
    setHasFinalBriefing(!!finalBriefing);
    console.log("Has final briefing:", !!finalBriefing);
  }, [briefingHistory]);
  
  // Find the latest briefing from the history or use the first result from agentResults
  const latestBriefing = briefingHistory.length > 0 
    ? briefingHistory[0] 
    : (agentResults && agentResults.length > 0 ? agentResults[0] : null);

  // Use the briefing editor hook
  const { 
    editedContent, 
    setEditedContent, 
    resetContent 
  } = useBriefingEditor({
    initialContent: latestBriefing?.content || '',
    isGenerating
  });

  // Navigate to persona development
  const goToNextStep = async () => {
    try {
      console.log("Going to persona development for strategy:", strategy.id);
      
      // First, update the strategy state to persona
      const { data, error } = await supabase
        .from('strategies')
        .update({ state: 'persona' })
        .eq('id', strategy.id)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to update strategy state");
        return;
      }
      
      console.log("Strategy state updated successfully:", data);
      toast.success("Moving to persona development");
      
      // Navigate directly to the strategy details page
      // This ensures we load the persona development view based on the updated state
      navigate(`/strategy-details/${strategy.id}`);
    } catch (err) {
      console.error("Failed to move to persona development:", err);
      toast.error("Failed to move to persona development");
    }
  };

  // Wrapper function to save agent results with the correct interface
  const saveAgentResult = async (content: string, isFinal?: boolean): Promise<void> => {
    try {
      const metadata = {
        version: briefingHistory.length > 0 ? 
          ((briefingHistory[0].metadata?.version || 0) + 1) : 1,
        is_final: isFinal || false,
        saved_at: new Date().toISOString()
      };
      
      const savedResult = await saveAgentResultToDb(strategy.id, content, metadata);
      
      if (savedResult) {
        // Add to the local state
        setBriefingHistory(prev => [savedResult, ...prev]);
      }
      
      if (isFinal) {
        setHasFinalBriefing(true);
      }
    } catch (error) {
      console.error("Error saving briefing:", error);
      throw error;
    }
  };

  const handleBriefingSaved = (isFinal: boolean) => {
    console.log("Briefing saved with isFinal:", isFinal);
    if (isFinal) {
      setHasFinalBriefing(true);
    }
  };

  // Modified to properly handle the enhancement text
  const handleGenerateBriefing = (enhancementText?: string): void => {
    console.log("Generating briefing with enhancement:", enhancementText);
    generateBriefing(formValues, enhancementText);
  };

  // Wrap the saveStrategyMetadata function to make it return void instead of boolean
  const saveStrategyMetadata = async (values: any): Promise<void> => {
    await saveMetadata(values);
    // Void return type, no need to return anything
  };

  // Determine which content to show on the left side
  const leftContent = showCrawler ? (
    <WebsiteCrawlerWrapper 
      onBack={() => setShowCrawler(false)}
      crawlResults={crawlResults}
      setCrawlResults={setCrawlResults}
    />
  ) : (
    <StrategyInfoCard 
      formValues={formValues}
      saveStrategyMetadata={saveStrategyMetadata}
      showCrawler={showCrawler}
      setShowCrawler={setShowCrawler}
    />
  );
  
  // Fixed prop passing to BriefingEditorPanel
  const rightContent = (
    <BriefingEditorPanel
      strategy={strategy}
      briefing={latestBriefing?.content || ''}
      onUpdateBriefing={(content) => {
        setEditedContent(content);
        saveAgentResult(content, false);
      }}
    />
  );

  return (
    <div className="space-y-6">
      <BriefingHeader 
        hasFinalBriefing={hasFinalBriefing}
        goToNextStep={goToNextStep}
      />
      
      <BriefingLayout
        leftContent={leftContent}
        rightContent={rightContent}
      />
    </div>
  );
};

export default StrategyBriefing;
