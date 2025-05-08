
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ArrowDown } from 'lucide-react';
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
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  isGenerating,
  error,
  generateResult,
  hasResults
}) => {
  return (
    <div className="bg-slate-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">AI-Powered Value Proposition Canvas Generator</h3>
      <p className="mb-6">
        Generate customer jobs, pains, and gains automatically based on your marketing brief 
        and persona information. Then select which elements to add to your canvas.
      </p>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={generateResult} 
                disabled={isGenerating}
                className="flex items-center"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Canvas Data...
                  </>
                ) : (
                  <>
                    Generate Canvas Data
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Analyze your marketing brief and personas to automatically generate customer profile elements
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {!isGenerating && hasResults && (
        <div className="mt-6 flex justify-center">
          <ArrowDown className="animate-bounce h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  );
};

export default GeneratorForm;
