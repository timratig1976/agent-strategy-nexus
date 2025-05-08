
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

interface BriefingAIFormProps {
  strategyId: string;
  formData: any;
  onComplete: (content: string) => void;
}

const BriefingAIForm: React.FC<BriefingAIFormProps> = ({ strategyId, formData, onComplete }) => {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('deutsch');

  const handleGenerate = async () => {
    setIsLoading(true);
    
    try {
      const response = await MarketingAIService.generateContent(
        'briefing',
        'generate',
        {
          strategyId,
          formData: {
            ...formData,
            additionalInfo: additionalInfo || formData.additionalInfo
          }
        },
        { outputLanguage }
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        // Safely access content or rawOutput
        const resultContent = response.data && typeof response.data === 'object' 
          ? ((response.data as any).content || (response.data as any).rawOutput || '')
          : '';
        
        onComplete(resultContent);
        toast.success(outputLanguage === 'deutsch' ? 
          "Briefing erfolgreich generiert!" : 
          "Briefing successfully generated!");
      }
    } catch (error) {
      console.error("Error generating briefing:", error);
      toast.error(outputLanguage === 'deutsch' ? 
        `Fehler beim Generieren des Briefings: ${error instanceof Error ? error.message : String(error)}` : 
        `Error generating briefing: ${error instanceof Error ? error.message : String(error)}`);
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
              <h3 className="text-lg font-medium">{outputLanguage === 'deutsch' ? 'KI-Briefing generieren' : 'Generate AI Briefing'}</h3>
            </div>
            <LanguageSelector value={outputLanguage} onChange={setOutputLanguage} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">{outputLanguage === 'deutsch' ? 'Zusätzliche Informationen' : 'Additional Information'}</Label>
            <Textarea
              id="additionalInfo"
              placeholder={outputLanguage === 'deutsch' ? 
                "Fügen Sie hier weitere Details hinzu, die Sie in Ihrem Briefing berücksichtigen möchten..." : 
                "Add any additional details you want to include in your briefing..."}
              rows={4}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {outputLanguage === 'deutsch' ? 
                "Dies ist optional und wird mit Ihren Unternehmens- und Produktdetails kombiniert, um ein umfassendes Briefing zu erstellen." : 
                "This is optional and will be combined with your company and product details to create a comprehensive briefing."}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleGenerate} 
          disabled={isLoading}
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
              {outputLanguage === 'deutsch' ? 'Briefing generieren' : 'Generate Briefing'}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BriefingAIForm;
