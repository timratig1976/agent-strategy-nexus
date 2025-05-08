
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Sparkles, Bug } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GeneratorFormProps {
  isGenerating: boolean;
  error: string | null;
  generateResult: () => Promise<void>;
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
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI-Powered Value Proposition Canvas Generator</CardTitle>
          </div>
          {onToggleDebug && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleDebug}
                    className={showDebug ? "bg-muted" : ""}
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
        <CardDescription>
          Generate customer jobs, pains, and gains automatically based on your marketing brief 
          and persona information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-muted/20 p-4 rounded-md">
          <h4 className="font-medium mb-2">How it works</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>We analyze your marketing brief and persona information</li>
            <li>Our AI generates customer jobs, pains, and gains</li>
            <li>You can review and add the generated elements to your canvas</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={generateResult} 
                disabled={isGenerating}
                className="flex items-center gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Canvas Data...
                  </>
                ) : hasResults ? (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Regenerate Canvas Data
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
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
