
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import BriefingContentEditor from "./BriefingContentEditor";
import BriefingActionBar from "./BriefingActionBar";
import BriefingAIEnhancer from "./BriefingAIEnhancer";
import PromptMonitor from "./PromptMonitor";
import { AgentResult } from "@/types/marketing";

interface BriefingEditorPanelProps {
  title: string;
  latestBriefing: AgentResult | null;
  editedContent: string;
  setEditedContent: (content: string) => void;
  enhancementText: string;
  setEnhancementText: (text: string) => void;
  isGenerating: boolean;
  progress: number;
  briefingHistory: AgentResult[];
  aiDebugInfo: any;
  error: string | null;
  generateBriefing: (enhancementText?: string) => void;
  handleSaveBriefing: (isFinal: boolean) => Promise<void>;
  enhancerExpanded: boolean;
  toggleEnhancerExpanded: () => void;
  showPromptMonitor: boolean;
  togglePromptMonitor: () => void;
  generateButtonText: string;
  saveButtonText: string;
  saveFinalButtonText: string;
  placeholderText: string;
}

const BriefingEditorPanel: React.FC<BriefingEditorPanelProps> = ({
  title,
  latestBriefing,
  editedContent,
  setEditedContent,
  enhancementText,
  setEnhancementText,
  isGenerating,
  progress,
  briefingHistory,
  aiDebugInfo,
  error,
  generateBriefing,
  handleSaveBriefing,
  enhancerExpanded,
  toggleEnhancerExpanded,
  showPromptMonitor,
  togglePromptMonitor,
  generateButtonText,
  saveButtonText,
  saveFinalButtonText,
  placeholderText
}) => {
  const handleGenerate = () => {
    generateBriefing(enhancementText);
    setEnhancementText("");
    toggleEnhancerExpanded();
  };

  const onSelectHistoricalVersion = (content: string) => {
    setEditedContent(content);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <BriefingActionBar 
          isGenerating={isGenerating}
          generateButtonText={generateButtonText}
          onGenerate={handleGenerate}
          briefingHistory={briefingHistory}
          onSelectHistoricalVersion={onSelectHistoricalVersion}
          aiDebugInfo={aiDebugInfo}
          showPromptMonitor={showPromptMonitor}
          togglePromptMonitor={togglePromptMonitor}
        />
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col">
        {/* Display error if present */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error generating briefing</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Special Instructions first */}
        <BriefingAIEnhancer 
          enhancementText={enhancementText} 
          setEnhancementText={setEnhancementText}
          isExpanded={enhancerExpanded}
          onToggleExpand={toggleEnhancerExpanded}
          onSubmit={handleGenerate}
          isGenerating={isGenerating}
        />
        
        {/* Content Editor */}
        <div className="flex-grow mt-4">
          <BriefingContentEditor 
            content={latestBriefing?.content || ""} 
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            isGenerating={isGenerating}
            progress={progress}
            placeholder={placeholderText}
          />
        </div>
        
        {showPromptMonitor && aiDebugInfo && (
          <div className="mt-4">
            <PromptMonitor debugInfo={aiDebugInfo} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 w-full">
        <Button 
          variant="outline" 
          onClick={() => handleSaveBriefing(false)} 
          disabled={isGenerating || !editedContent.trim()} 
          className="flex-1"
        >
          {saveButtonText}
        </Button>
        <Button 
          onClick={() => handleSaveBriefing(true)} 
          disabled={isGenerating || !editedContent.trim()}
          className="flex-1"
        >
          {saveFinalButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BriefingEditorPanel;
