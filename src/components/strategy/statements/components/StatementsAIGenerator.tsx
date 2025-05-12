
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, PlusCircle, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface StatementsAIGeneratorProps {
  onGenerate: (customPrompt?: string) => Promise<{
    painStatements: Array<{ content: string; impact: string }>;
    gainStatements: Array<{ content: string; impact: string }>;
  }>;
  onAddStatements: (
    painStatements: Array<{ content: string; impact: string }>, 
    gainStatements: Array<{ content: string; impact: string }>
  ) => void;
  isGenerating: boolean;
  progress: number;
  disabled?: boolean;
  customPrompt?: string;
}

const StatementsAIGenerator: React.FC<StatementsAIGeneratorProps> = ({
  onGenerate,
  onAddStatements,
  isGenerating,
  progress,
  disabled = false,
  customPrompt = ''
}) => {
  const [genResults, setGenResults] = useState<{
    painStatements: Array<{ content: string; impact: string }>;
    gainStatements: Array<{ content: string; impact: string }>;
  } | null>(null);
  const [briefingInfo, setBriefingInfo] = useState('');
  const [showBriefingInput, setShowBriefingInput] = useState(false);

  const handleGenerate = async () => {
    try {
      // Combine custom prompt with additional briefing info if provided
      const finalPrompt = briefingInfo 
        ? `${customPrompt ? customPrompt + '\n\n' : ''}Additional context: ${briefingInfo}` 
        : customPrompt;
        
      const results = await onGenerate(finalPrompt);
      setGenResults(results);
      toast.success('Statements generated successfully!');
    } catch (error: any) {
      toast.error('Failed to generate statements: ' + (error.message || 'Unknown error'));
      console.error('Generation error:', error);
    }
  };

  const handleAddToList = () => {
    if (genResults) {
      onAddStatements(genResults.painStatements, genResults.gainStatements);
      toast.success('Statements added to your lists!');
      setGenResults(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Statement Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-500">
          Generate compelling pain and gain statements based on your USP Canvas data.
          {customPrompt ? ' A custom prompt has been set.' : ''}
        </p>

        {/* Additional briefing information input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
              onClick={() => setShowBriefingInput(!showBriefingInput)}
            >
              <Edit className="h-3 w-3 mr-1" />
              {showBriefingInput ? 'Hide additional context' : 'Add additional context'}
            </button>
          </div>
          
          {showBriefingInput && (
            <Textarea
              value={briefingInfo}
              onChange={(e) => setBriefingInfo(e.target.value)}
              placeholder="Add specific details about your product, target audience, or objectives to guide the AI..."
              className="text-sm"
              rows={3}
            />
          )}
        </div>

        {isGenerating ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Generating statements...</p>
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">
              {progress < 100
                ? `Processing ${Math.round(progress)}%`
                : 'Finalizing results...'}
            </p>
          </div>
        ) : genResults ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 p-3">
              <h4 className="font-medium text-sm text-green-800">Generated {genResults.painStatements.length} pain and {genResults.gainStatements.length} gain statements!</h4>
              <p className="text-xs text-green-700 mt-1">Review them and add to your collection.</p>
            </div>
            <Button 
              onClick={handleAddToList} 
              className="w-full"
              variant="outline"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to My Statements
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={disabled || isGenerating}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </Button>
        )}

        {disabled && (
          <p className="text-xs text-amber-600">
            USP Canvas data is required for generating statements. Please complete the USP Canvas first.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatementsAIGenerator;
