
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LoaderIcon, Sparkles } from 'lucide-react';
import { toast } from "sonner";
import { MarketingAIService } from '@/services/ai/marketingAIService';
import { LanguageSelector } from '@/components/ui/language-selector';
import { OutputLanguage } from '@/services/ai/types';

interface PersonaAIFormProps {
  strategyId: string;
  briefingContent: string;
  onComplete: (content: string) => void;
}

const PersonaAIForm: React.FC<PersonaAIFormProps> = ({ strategyId, briefingContent, onComplete }) => {
  const [enhancementText, setEnhancementText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('deutsch');

  const handleGenerate = async () => {
    if (!briefingContent) {
      toast.error(outputLanguage === 'deutsch' ? 
        "Das Briefing ist erforderlich, um Personas zu generieren." : 
        "Briefing is required to generate personas.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await MarketingAIService.generateContent(
        'persona',
        'generate',
        {
          strategyId,
          briefingContent,
          enhancementText
        },
        { outputLanguage }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        onComplete(response.data.content || response.data.rawOutput);
        toast.success(outputLanguage === 'deutsch' ? 
          "Personas erfolgreich generiert!" : 
          "Personas successfully generated!");
      }
    } catch (error) {
      console.error("Error generating personas:", error);
      toast.error(outputLanguage === 'deutsch' ? 
        `Fehler beim Generieren der Personas: ${error instanceof Error ? error.message : String(error)}` : 
        `Error generating personas: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sparkles size={20} className="text-yellow-500" />
              <h3 className="text-lg font-medium">{outputLanguage === 'deutsch' ? 'KI-Personas generieren' : 'Generate AI Personas'}</h3>
            </div>
            <LanguageSelector value={outputLanguage} onChange={setOutputLanguage} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="enhancementText">{outputLanguage === 'deutsch' ? 'Zusätzliche Anweisungen' : 'Additional Instructions'}</Label>
            <Textarea
              id="enhancementText"
              placeholder={outputLanguage === 'deutsch' ? 
                "Fügen Sie hier spezifische Anweisungen oder Details zur Personaerstellung hinzu..." : 
                "Add any specific instructions or details for persona creation..."}
              rows={4}
              value={enhancementText}
              onChange={(e) => setEnhancementText(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {outputLanguage === 'deutsch' ? 
                "Dies ist optional und wird mit Ihrem Briefing kombiniert, um spezifischere Personas zu erstellen." : 
                "This is optional and will be combined with your briefing to create more specific personas."}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !briefingContent}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <LoaderIcon size={16} className="animate-spin" />
              {outputLanguage === 'deutsch' ? 'Generiere...' : 'Generating...'}
            </>
          ) : (
            <>
              <Sparkles size={16} />
              {outputLanguage === 'deutsch' ? 'Personas generieren' : 'Generate Personas'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonaAIForm;
