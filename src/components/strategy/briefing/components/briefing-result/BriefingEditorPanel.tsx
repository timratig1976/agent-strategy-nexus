
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Sparkles } from "lucide-react";
import BriefingContentEditor from "./BriefingContentEditor";
import BriefingActionBar from "./BriefingActionBar";
import BriefingAIEnhancer from "./BriefingAIEnhancer";
import PromptMonitor from "./PromptMonitor";
import { AgentResult } from "@/types/marketing";
import { Progress } from "@/components/ui/progress";

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
  };

  const onSelectHistoricalVersion = (content: string) => {
    setEditedContent(content);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {/* Moved action bar to within the AI Generator block */}
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col space-y-6">
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
        
        {/* AI Generator section - now with border and clear separation */}
        <div className="border rounded-lg p-4 bg-muted/10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">AI Generator</h3>
            <BriefingActionBar 
              isGenerating={isGenerating}
              briefingHistory={briefingHistory}
              onSelectHistoricalVersion={onSelectHistoricalVersion}
              aiDebugInfo={aiDebugInfo}
              showPromptMonitor={showPromptMonitor}
              togglePromptMonitor={togglePromptMonitor}
            />
          </div>
          
          {/* Special Instructions without internal generate button */}
          <BriefingAIEnhancer 
            enhancementText={enhancementText} 
            setEnhancementText={setEnhancementText}
            isExpanded={enhancerExpanded}
            onToggleExpand={toggleEnhancerExpanded}
          />
          
          {/* Progress bar positioned between instructions and generate button */}
          {isGenerating && (
            <div className="space-y-2 mt-4 mb-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Generating briefing...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          
          {/* Generate button moved under the special instructions */}
          <Button 
            className="w-full mt-4 flex gap-1 items-center" 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles className="h-4 w-4" /> 
            {isGenerating ? "Generating..." : generateButtonText}
          </Button>
        </div>
        
        {/* Content Editor - now with border and clear separation */}
        <div className="border rounded-lg p-4 flex-grow">
          <h3 className="text-lg font-medium mb-3">Output</h3>
          <div className="h-full">
            <BriefingContentEditor 
              content={latestBriefing?.content || ""} 
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              isGenerating={isGenerating}
              progress={progress}
              placeholder={placeholderText}
            />
          </div>
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
