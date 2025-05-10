
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Info, Loader2, RefreshCcw, Bug } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface FormProps {
  isGenerating: boolean;
  error: string | null;
  generateResult: (enhancementText?: string, formatOptions?: any) => Promise<void>;
  hasResults: boolean;
  onToggleDebug: () => void;
  showDebug: boolean;
  progress?: number; // Add progress prop
}

const GeneratorForm: React.FC<FormProps> = ({ 
  isGenerating, 
  error, 
  generateResult,
  hasResults,
  onToggleDebug,
  showDebug,
  progress = 0 // Default to 0 if not provided
}) => {
  const [enhancementText, setEnhancementText] = useState<string>('');
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Use default format options
    const formatOptions = {
      strictFormat: true,
      outputLanguage: 'english'
    };
    await generateResult(enhancementText, formatOptions);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Customer Profile Generator</CardTitle>
        <CardDescription>
          Generate customer jobs, pains, and gains based on your marketing briefing and target audience.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              id="enhancementText"
              placeholder="Add specific requirements, industry focus, or other directions for the AI... (Optional)"
              className="h-24"
              value={enhancementText}
              onChange={(e) => setEnhancementText(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between items-center w-full">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={onToggleDebug}
              className="flex items-center gap-1"
            >
              <Bug className="h-4 w-4 mr-1" />
              {showDebug ? "Hide Debug" : "Debug"}
            </Button>
            
            <div className="flex gap-2">
              {hasResults && (
                <Button
                  type="button" 
                  variant="outline"
                  disabled={isGenerating}
                  onClick={() => generateResult(enhancementText)}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              )}
              
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Info className="h-4 w-4 mr-2" />
                    Generate Customer Profile
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Add progress bar that only shows when generating */}
          {isGenerating && (
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Generating content...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full h-1" />
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default GeneratorForm;
