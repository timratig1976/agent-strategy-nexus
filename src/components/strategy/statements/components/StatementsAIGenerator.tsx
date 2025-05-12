
import React, { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import CustomPromptDialog from './CustomPromptDialog';

interface StatementsAIGeneratorProps {
  onGenerate: (customPrompt?: string) => Promise<{ painStatements: any[], gainStatements: any[] }>;
  onAddStatements: (painStatements: any[], gainStatements: any[]) => void;
  isGenerating: boolean;
  progress: number;
  disabled?: boolean;
}

const StatementsAIGenerator: React.FC<StatementsAIGeneratorProps> = ({
  onGenerate,
  onAddStatements,
  isGenerating,
  progress,
  disabled = false
}) => {
  const [generatedStatements, setGeneratedStatements] = useState<{
    painStatements: any[];
    gainStatements: any[];
  } | null>(null);
  
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const handleGenerate = async () => {
    try {
      const result = await onGenerate(customPrompt);
      setGeneratedStatements(result);
    } catch (error) {
      console.error('Error generating statements:', error);
      toast.error('Failed to generate statements');
    }
  };

  const handleAddStatements = () => {
    if (generatedStatements) {
      onAddStatements(
        generatedStatements.painStatements,
        generatedStatements.gainStatements
      );
      setGeneratedStatements(null);
      toast.success('AI-generated statements added successfully');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Generate Statements with AI
          </CardTitle>
          <CustomPromptDialog 
            defaultPrompt={customPrompt}
            onSavePrompt={setCustomPrompt}
          />
        </div>
        {customPrompt && (
          <div className="text-xs text-muted-foreground mt-2 italic border-l-2 border-blue-200 pl-2">
            Custom instructions enabled: {customPrompt.substring(0, 100)}{customPrompt.length > 100 ? '...' : ''}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Use AI to automatically generate powerful pain and gain statements based on your USP Canvas.
          These statements will help make your marketing messages more impactful.
        </p>
        
        {isGenerating && (
          <div className="my-6">
            <p className="text-sm font-medium mb-2">Generating statements...</p>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        {generatedStatements && (
          <div className="space-y-4 my-6">
            <h3 className="text-sm font-semibold">Generated Statements Preview:</h3>
            
            <div className="border rounded-md p-3 bg-gray-50">
              <h4 className="text-sm font-medium mb-2">Pain Statements ({generatedStatements.painStatements.length})</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {generatedStatements.painStatements.slice(0, 3).map((statement, index) => (
                  <li key={index} className="mb-1">{statement.content}</li>
                ))}
                {generatedStatements.painStatements.length > 3 && (
                  <li className="italic">...and {generatedStatements.painStatements.length - 3} more</li>
                )}
              </ul>
            </div>
            
            <div className="border rounded-md p-3 bg-gray-50">
              <h4 className="text-sm font-medium mb-2">Gain Statements ({generatedStatements.gainStatements.length})</h4>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                {generatedStatements.gainStatements.slice(0, 3).map((statement, index) => (
                  <li key={index} className="mb-1">{statement.content}</li>
                ))}
                {generatedStatements.gainStatements.length > 3 && (
                  <li className="italic">...and {generatedStatements.gainStatements.length - 3} more</li>
                )}
              </ul>
            </div>
          </div>
        )}
        
        {!generatedStatements && !isGenerating && (
          <Alert className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              AI-generated statements are based on your USP Canvas data. Make sure you have completed the USP Canvas before generating statements.
              {customPrompt && <p className="mt-1">You have provided custom instructions to improve the output.</p>}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-3 bg-gray-50">
        {generatedStatements ? (
          <>
            <Button variant="secondary" onClick={() => setGeneratedStatements(null)}>
              Discard
            </Button>
            <Button onClick={handleAddStatements}>
              Add All Statements
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || disabled}
            className="gap-2"
            variant="default"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate Statements'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StatementsAIGenerator;
