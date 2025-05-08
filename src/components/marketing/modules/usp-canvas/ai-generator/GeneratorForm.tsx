
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Sparkles, Bug, ChevronDown, ChevronUp, InfoCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface GeneratorFormProps {
  isGenerating: boolean;
  error: string | null;
  generateResult: (enhancementText?: string) => Promise<void>;
  hasResults: boolean;
  showDebug?: boolean;
  onToggleDebug?: () => void;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  isGenerating,
  error,
  generateResult,
  hasResults,
  showDebug = false,
  onToggleDebug
}) => {
  const [enhancementText, setEnhancementText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = () => {
    generateResult(enhancementText);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Value Proposition Canvas Generator</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">How it works</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>We analyze your marketing brief and persona information</li>
                    <li>Our AI generates customer jobs, pains, and gains</li>
                    <li>You can review and add the generated elements to your canvas</li>
                  </ol>
                </div>
              </PopoverContent>
            </Popover>
            
            {onToggleDebug && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleDebug}
                      className={`h-8 w-8 ${showDebug ? "bg-muted" : ""}`}
                    >
                      <Bug className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showDebug ? "Hide" : "Show"} debug information</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <CardDescription>
          Generate customer jobs, pains, and gains automatically from your marketing brief.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-2 space-y-2">
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          type="button" 
          variant="ghost" 
          className="flex items-center justify-between w-full py-1 h-auto"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className="text-sm">Advanced Options</span>
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {showAdvanced && (
          <div className="space-y-1">
            <label htmlFor="enhancement-text" className="text-xs font-medium">
              Additional Prompt Information
            </label>
            <Textarea
              id="enhancement-text"
              placeholder="Add specific instructions or focus areas for the AI generation"
              value={enhancementText}
              onChange={(e) => setEnhancementText(e.target.value)}
              className="min-h-[60px] text-sm"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="py-2 flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : hasResults ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Regenerate Canvas Data
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Canvas Data
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                {hasResults 
                  ? "Generate fresh canvas elements based on your briefing" 
                  : "Create customer jobs, pains, and gains based on your marketing brief"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default GeneratorForm;
