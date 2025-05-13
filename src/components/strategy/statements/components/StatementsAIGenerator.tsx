import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { useStrategyDebug } from "@/hooks/useStrategyDebug";

export interface StatementsAIGeneratorProps {
  customPrompt?: string;
  onCustomPromptSave?: (prompt: string) => void;
  onGenerate: (additionalPrompt?: string) => Promise<{ painStatements: any[]; gainStatements: any[]; }>;
  onAddGeneratedStatements: (painStatements: any[], gainStatements: any[]) => void;
  isGenerating: boolean;
  progress: number;
  disabled?: boolean;
}

const StatementsAIGenerator: React.FC<StatementsAIGeneratorProps> = ({
  customPrompt = '',
  onCustomPromptSave,
  onGenerate,
  onAddGeneratedStatements,
  isGenerating,
  progress,
  disabled = false,
}) => {
  
  const [generatedPainStatements, setGeneratedPainStatements] = useState<any[]>([]);
  const [generatedGainStatements, setGeneratedGainStatements] = useState<any[]>([]);
  const [additionalPrompt, setAdditionalPrompt] = useState<string>('');
  const [isCustomPromptSaved, setIsCustomPromptSaved] = useState<boolean>(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState<boolean>(false);
  
  const { isDebugEnabled } = useStrategyDebug();
  
  const handleGenerate = useCallback(async () => {
    setIsGenerationComplete(false);
    
    const { painStatements, gainStatements } = await onGenerate(additionalPrompt);
    
    setGeneratedPainStatements(painStatements);
    setGeneratedGainStatements(gainStatements);
    setIsGenerationComplete(true);
  }, [onGenerate, additionalPrompt]);

  const handleAddStatements = useCallback(() => {
    onAddGeneratedStatements(generatedPainStatements, generatedGainStatements);
    setGeneratedPainStatements([]);
    setGeneratedGainStatements([]);
    setIsGenerationComplete(false);
    toast.success("Statements added successfully!");
  }, [onAddGeneratedStatements, generatedPainStatements, generatedGainStatements]);

  const handleSaveCustomPrompt = useCallback(async () => {
    if (onCustomPromptSave) {
      await onCustomPromptSave(customPrompt);
      setIsCustomPromptSaved(true);
      toast.success("Custom prompt saved successfully!");
    }
  }, [onCustomPromptSave, customPrompt]);
  
  // Reset state when generation starts
  useEffect(() => {
    if (isGenerating) {
      setIsGenerationComplete(false);
    }
  }, [isGenerating]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="additional-prompt" className="text-sm font-medium">Additional Prompt (Optional)</label>
            <Textarea
              id="additional-prompt"
              placeholder="Add any specific instructions or context here..."
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || disabled}
          >
            {isGenerating ? 'Generating...' : 'Generate Statements'}
          </Button>
          
          {isGenerating && (
            <Progress value={progress} className="mt-2" />
          )}
        </CardContent>
      </Card>

      {isGenerationComplete && (
        <Card>
          <CardContent className="space-y-4">
            {generatedPainStatements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Generated Pain Statements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {generatedPainStatements.map((statement, index) => (
                    <li key={index}>{typeof statement === 'string' ? statement : statement.content}</li>
                  ))}
                </ul>
              </div>
            )}

            {generatedGainStatements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Generated Gain Statements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {generatedGainStatements.map((statement, index) => (
                    <li key={index}>{typeof statement === 'string' ? statement : statement.content}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddStatements}>Add Statements</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default StatementsAIGenerator;
