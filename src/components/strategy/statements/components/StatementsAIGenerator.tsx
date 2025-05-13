
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

export interface StatementsAIGeneratorProps {
  onGenerate: (customPrompt?: string) => Promise<any>;
  isGenerating: boolean;
  progress: number;
  disabled?: boolean;
  customPrompt?: string;
  onSaveCustomPrompt?: (prompt: string) => void;
  onAddGeneratedStatements: (painStatements: any[], gainStatements: any[]) => void;
}

const StatementsAIGenerator: React.FC<StatementsAIGeneratorProps> = ({
  onGenerate,
  isGenerating,
  progress,
  disabled = false,
  customPrompt = '',
  onSaveCustomPrompt,
  onAddGeneratedStatements
}) => {
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [prompt, setPrompt] = useState(customPrompt);
  const [generatedStatements, setGeneratedStatements] = useState<{
    painStatements: any[];
    gainStatements: any[];
  } | null>(null);

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    try {
      const result = await onGenerate(showCustomPrompt ? prompt : undefined);
      if (result && result.painStatements && result.gainStatements) {
        setGeneratedStatements(result);
      }
    } catch (error) {
      console.error('Error generating statements:', error);
    }
  };

  const handleAddGeneratedStatements = () => {
    if (generatedStatements) {
      onAddGeneratedStatements(
        generatedStatements.painStatements,
        generatedStatements.gainStatements
      );
      setGeneratedStatements(null);
    }
  };

  const handleSaveCustomPrompt = () => {
    if (onSaveCustomPrompt) {
      onSaveCustomPrompt(prompt);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Statement Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showCustomPrompt && (
          <div className="space-y-2">
            <Textarea
              placeholder="Enter custom instructions for the AI..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="w-full"
            />
            {onSaveCustomPrompt && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveCustomPrompt}
                disabled={isGenerating}
              >
                Save Custom Prompt
              </Button>
            )}
          </div>
        )}
        
        {isGenerating && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-muted-foreground">
              Generating statements... {progress}%
            </p>
          </div>
        )}
        
        {generatedStatements && !isGenerating && (
          <div className="space-y-2">
            <p className="text-sm">
              Generated {generatedStatements.painStatements.length} pain statements and {generatedStatements.gainStatements.length} gain statements.
            </p>
            <Button 
              onClick={handleAddGeneratedStatements} 
              variant="outline" 
              size="sm"
            >
              Add to Statements
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCustomPrompt(!showCustomPrompt)}
          disabled={isGenerating}
        >
          {showCustomPrompt ? 'Hide Custom Prompt' : 'Custom Prompt'}
        </Button>
        
        <Button 
          onClick={handleGenerate} 
          disabled={disabled || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Statements'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatementsAIGenerator;
