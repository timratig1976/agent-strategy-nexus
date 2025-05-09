
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateUspCanvasProfile } from '@/services/ai/uspCanvasService';
import { StoredAIResult } from '../types';
import AIResultsPanel from './AIResultsPanel';
import AIResultsItem from './AIResultsItem';
import { supabase } from '@/integrations/supabase/client';
import { OutputLanguage } from '@/services/ai/types';

interface AIGeneratorLayoutProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  storedAIResult: StoredAIResult;
  onAddJobs: (jobs: any[]) => void;
  onAddPains: (pains: any[]) => void;
  onAddGains: (gains: any[]) => void;
  onResultsGenerated: (results: StoredAIResult, debugInfo?: any) => void;
}

const AIGeneratorLayout: React.FC<AIGeneratorLayoutProps> = ({
  strategyId,
  briefingContent,
  personaContent,
  storedAIResult,
  onAddJobs,
  onAddPains,
  onAddGains,
  onResultsGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [enhancementText, setEnhancementText] = useState('');
  const [activeTab, setActiveTab] = useState<string>('jobs');
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('english');

  // Fetch strategy language from the database
  useEffect(() => {
    const fetchStrategyLanguage = async () => {
      if (strategyId && strategyId !== 'standalone-module') {
        try {
          const { data, error } = await supabase
            .from('strategies')
            .select('language')
            .eq('id', strategyId)
            .single();
            
          if (error) {
            console.error("Error fetching strategy language:", error);
            return;
          }
          
          // If the language is valid, set it as the output language
          if (data?.language && (data.language === 'english' || data.language === 'deutsch')) {
            setOutputLanguage(data.language as OutputLanguage);
          }
        } catch (err) {
          console.error("Error in fetching strategy language:", err);
        }
      }
    };
    
    fetchStrategyLanguage();
  }, [strategyId]);

  const handleGenerateAll = async () => {
    if (!briefingContent) {
      toast.error(outputLanguage === 'deutsch' 
        ? "Briefing-Inhalt ist erforderlich, um KI-generierte Inhalte zu erstellen." 
        : "Briefing content is required to create AI-generated content.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateUspCanvasProfile(
        strategyId,
        briefingContent,
        'all',
        enhancementText,
        personaContent,
        { outputLanguage }
      );

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        toast.success(outputLanguage === 'deutsch' 
          ? "Kundenprofil erfolgreich erstellt!" 
          : "Customer profile successfully created!");
        onResultsGenerated({
          jobs: response.data.jobs || [],
          pains: response.data.pains || [],
          gains: response.data.gains || []
        }, response.debugInfo);
      }
    } catch (error) {
      console.error("Error generating customer profile:", error);
      toast.error(outputLanguage === 'deutsch'
        ? "Fehler beim Generieren des Kundenprofils: " + (error instanceof Error ? error.message : String(error))
        : "Error generating customer profile: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsGenerating(false);
    }
  };

  // Get UI labels based on language
  const getUILabels = () => {
    if (outputLanguage === 'deutsch') {
      return {
        title: "KI-Kundenprofil-Generator",
        textareaPlaceholder: "Optionale Anweisungen für die KI. Geben Sie zusätzliche Details oder Anpassungen an...",
        buttonText: isGenerating ? 'Generiere...' : 'Kundenprofil generieren',
        jobs: "Kundenaufgaben",
        pains: "Kundenprobleme",
        gains: "Kundenvorteile",
        priority: "Priorität",
        severity: "Schwere",
        importance: "Wichtigkeit"
      };
    }
    
    return {
      title: "AI Customer Profile Generator",
      textareaPlaceholder: "Optional instructions for AI. Add additional details or customizations...",
      buttonText: isGenerating ? 'Generating...' : 'Generate Customer Profile',
      jobs: "Customer Jobs",
      pains: "Customer Pains",
      gains: "Customer Gains",
      priority: "Priority",
      severity: "Severity",
      importance: "Importance"
    };
  };
  
  const labels = getUILabels();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{labels.title}</h3>
          </div>
          
          <textarea 
            placeholder={labels.textareaPlaceholder}
            className="w-full border rounded-md p-3 h-24"
            value={enhancementText}
            onChange={(e) => setEnhancementText(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerateAll} 
              disabled={isGenerating || !briefingContent}
            >
              {labels.buttonText}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="jobs">{labels.jobs}</TabsTrigger>
            <TabsTrigger value="pains">{labels.pains}</TabsTrigger>
            <TabsTrigger value="gains">{labels.gains}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs">
            <AIResultsPanel
              title={labels.jobs}
              items={storedAIResult.jobs}
              onAddItems={onAddJobs}
              renderItem={(item, index) => (
                <AIResultsItem 
                  key={index}
                  item={item}
                  ratingProperty="priority"
                  ratingLabel={labels.priority}
                />
              )}
            />
          </TabsContent>
          
          <TabsContent value="pains">
            <AIResultsPanel
              title={labels.pains}
              items={storedAIResult.pains}
              onAddItems={onAddPains}
              renderItem={(item, index) => (
                <AIResultsItem 
                  key={index}
                  item={item}
                  ratingProperty="severity"
                  ratingLabel={labels.severity}
                />
              )}
            />
          </TabsContent>
          
          <TabsContent value="gains">
            <AIResultsPanel
              title={labels.gains}
              items={storedAIResult.gains}
              onAddItems={onAddGains}
              renderItem={(item, index) => (
                <AIResultsItem 
                  key={index}
                  item={item}
                  ratingProperty="importance"
                  ratingLabel={labels.importance}
                />
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIGeneratorLayout;
