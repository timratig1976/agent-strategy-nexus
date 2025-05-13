
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { AIGeneratorPanelProps } from "./types";
import AIInstructionsInput from "./AIInstructionsInput";
import AIContentEditor from "./AIContentEditor";
import AIActionBar from "./AIActionBar";
import AIDebugMonitor from "./AIDebugMonitor";

/**
 * Main component for AI content generation
 */
const AIGeneratorPanel = <T extends { id?: string; content: string; createdAt?: string | Date; metadata?: Record<string, any> }>({
  title,
  latestResult,
  editedContent,
  setEditedContent,
  enhancementText,
  setEnhancementText,
  isGenerating,
  progress,
  generationHistory,
  aiDebugInfo,
  error,
  generateContent,
  handleSaveContent,
  enhancerExpanded,
  toggleEnhancerExpanded,
  showPromptMonitor,
  togglePromptMonitor,
  generateButtonText = "Generate",
  saveButtonText = "Save Draft",
  saveFinalButtonText = "Save as Final",
  placeholderText = "Generated content will appear here..."
}: AIGeneratorPanelProps<T>) => {
  const handleGenerate = () => {
    generateContent(enhancementText);
  };

  const onSelectHistoricalVersion = (content: string) => {
    setEditedContent(content);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div>
          {aiDebugInfo && (
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  Show AI Log
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <AIDebugMonitor debugInfo={aiDebugInfo} />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col space-y-6">
        {/* Display error if present */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error generating content</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {/* AI Generator section */}
        <div className="border rounded-lg p-4 bg-muted/10">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">AI Generator</h3>
          </div>
          
          {/* Special Instructions without internal generate button */}
          <AIInstructionsInput 
            enhancementText={enhancementText} 
            setEnhancementText={setEnhancementText}
            isExpanded={enhancerExpanded}
            onToggleExpand={toggleEnhancerExpanded}
          />
          
          {/* Progress bar positioned between instructions and generate button */}
          {isGenerating && (
            <div className="mt-4 mb-4">
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
        
        {/* Content Editor */}
        <div className="border rounded-lg p-4 flex-grow">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Output</h3>
          </div>
          
          <div className="h-full">
            <AIContentEditor 
              content={latestResult?.content || ""} 
              editedContent={editedContent}
              setEditedContent={setEditedContent}
              isGenerating={isGenerating}
              progress={progress}
              placeholder={placeholderText}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 w-full">
        <AIActionBar
          onSave={() => handleSaveContent(false)}
          onSaveFinal={() => handleSaveContent(true)}
          isGenerating={isGenerating}
          saveButtonText={saveButtonText}
          saveFinalButtonText={saveFinalButtonText}
          generationHistory={generationHistory}
          onSelectHistoricalVersion={onSelectHistoricalVersion}
        />
      </CardFooter>
    </Card>
  );
};

export default AIGeneratorPanel;
