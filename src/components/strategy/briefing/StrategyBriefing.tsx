
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { StrategyBriefingProps } from "./types";

// Import components
import { BriefingResult } from "./components/briefing-result/BriefingResult";
import { BriefingHeader, BriefingLayout } from "./components";
import StrategyInfoCard from "./components/strategy-info/StrategyInfoCard";
import WebsiteCrawlerWrapper from "./WebsiteCrawlerWrapper";

// Import hooks
import { useBriefingGenerator } from "./hooks/useBriefingGenerator";
import { useStrategyMetadata } from "./hooks/useStrategyMetadata";

const StrategyBriefing: React.FC<StrategyBriefingProps> = ({ 
  strategy, 
  agentResults = [] 
}) => {
  const navigate = useNavigate();
  const [showCrawler, setShowCrawler] = useState<boolean>(false);
  const [crawlResults, setCrawlResults] = useState<any | null>(null);
  const [hasFinalBriefing, setHasFinalBriefing] = useState<boolean>(false);
  
  // Use our custom hook for form state management
  const { formValues, saveStrategyMetadata } = useStrategyMetadata(strategy.id);
  
  // Use our custom hook for briefing generation
  const {
    isGenerating,
    progress,
    generateBriefing,
    saveAgentResult,
    briefingHistory,
    setBriefingHistory,
    aiDebugInfo
  } = useBriefingGenerator(strategy.id);
  
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

  // Navigate to persona development
  const goToNextStep = () => {
    // First, try to update the strategy state to persona
    supabase
      .from('strategies')
      .update({ state: 'persona' })
      .eq('id', strategy.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating strategy state:", error);
          toast.error("Failed to update strategy state");
        } else {
          // Navigate to the persona development page
          navigate(`/strategy/${strategy.id}?tab=personas`);
          toast.success("Moving to persona development");
        }
      });
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
  
  // Determine what to show on the right side
  const rightContent = (
    <BriefingResult 
      latestBriefing={latestBriefing}
      isGenerating={isGenerating}
      progress={progress}
      generateBriefing={handleGenerateBriefing}
      saveAgentResult={saveAgentResult}
      briefingHistory={briefingHistory}
      setBriefingHistory={setBriefingHistory}
      onBriefingSaved={handleBriefingSaved}
      aiDebugInfo={aiDebugInfo}
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
