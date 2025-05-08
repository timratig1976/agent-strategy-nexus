
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Loader2, RefreshCcw, Bug } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormProps {
  isGenerating: boolean;
  error: string | null;
  generateResult: (enhancementText?: string, formatOptions?: any) => Promise<void>;
  hasResults: boolean;
  onToggleDebug: () => void;
  showDebug: boolean;
}

const GeneratorForm: React.FC<FormProps> = ({ 
  isGenerating, 
  error, 
  generateResult,
  hasResults,
  onToggleDebug,
  showDebug
}) => {
  const [enhancementText, setEnhancementText] = useState<string>('');
  const [strictFormat, setStrictFormat] = useState<boolean>(true);
  const [outputLanguage, setOutputLanguage] = useState<string>('english');
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formatOptions = {
      strictFormat,
      outputLanguage
    };
    await generateResult(enhancementText, formatOptions);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">AI Value Proposition Generator</CardTitle>
        <CardDescription>
          Generate customer jobs, pains, and gains based on your marketing briefing and target audience.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="enhancementText" className="mb-1 block">
              Custom Instructions (Optional)
            </Label>
            <Textarea
              id="enhancementText"
              placeholder="Add specific requirements, industry focus, or other directions for the AI..."
              className="h-24"
              value={enhancementText}
              onChange={(e) => setEnhancementText(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="strictFormat" className="block mb-1">Format Enforcement</Label>
                <span className="text-xs text-muted-foreground">Enable for better structure detection</span>
              </div>
              <Switch
                id="strictFormat"
                checked={strictFormat}
                onCheckedChange={setStrictFormat}
                disabled={isGenerating}
              />
            </div>
            
            <div>
              <Label htmlFor="outputLanguage" className="block mb-1">Output Language</Label>
              <Select
                value={outputLanguage}
                onValueChange={setOutputLanguage}
                disabled={isGenerating}
              >
                <SelectTrigger id="outputLanguage">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="deutsch">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between items-center">
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
                onClick={() => generateResult(enhancementText, { strictFormat, outputLanguage })}
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
                  Generate Value Proposition
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default GeneratorForm;
