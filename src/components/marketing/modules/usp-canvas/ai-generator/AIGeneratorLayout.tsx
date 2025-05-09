
import React, { useState } from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateUspCanvasProfile } from '@/services/ai/uspCanvasService';
import { StoredAIResult } from '../types';
import AIResultsPanel from './AIResultsPanel';
import AIResultsItem from './AIResultsItem';
import { LanguageSelector } from '@/components/ui/language-selector';
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
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('deutsch');

  const handleGenerateAll = async () => {
    if (!briefingContent) {
      toast.error("Briefing-Inhalt ist erforderlich, um KI-generierte Inhalte zu erstellen.");
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
        toast.success("Kundenprofil erfolgreich erstellt!");
        onResultsGenerated({
          jobs: response.data.jobs || [],
          pains: response.data.pains || [],
          gains: response.data.gains || []
        }, response.debugInfo);
      }
    } catch (error) {
      console.error("Error generating customer profile:", error);
      toast.error("Fehler beim Generieren des Kundenprofils: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">KI-Kundenprofil-Generator</h3>
            <LanguageSelector value={outputLanguage} onChange={setOutputLanguage} />
          </div>
          
          <textarea 
            placeholder="Optionale Anweisungen für die KI. Geben Sie zusätzliche Details oder Anpassungen an..."
            className="w-full border rounded-md p-3 h-24"
            value={enhancementText}
            onChange={(e) => setEnhancementText(e.target.value)}
          />
          
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerateAll} 
              disabled={isGenerating || !briefingContent}
            >
              {isGenerating ? 'Generiere...' : 'Kundenprofil generieren'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="jobs">Kundenaufgaben</TabsTrigger>
            <TabsTrigger value="pains">Kundenprobleme</TabsTrigger>
            <TabsTrigger value="gains">Kundenvorteile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs">
            <AIResultsPanel
              title="Kundenaufgaben"
              items={storedAIResult.jobs}
              onAddItems={onAddJobs}
              renderItem={(item, index) => (
                <AIResultsItem 
                  key={index}
                  item={item}
                  ratingProperty="priority"
                  ratingLabel="Priorität"
                />
              )}
            />
          </TabsContent>
          
          <TabsContent value="pains">
            <AIResultsPanel
              title="Kundenprobleme"
              items={storedAIResult.pains}
              onAddItems={onAddPains}
              renderItem={(item, index) => (
                <AIResultsItem 
                  key={index}
                  item={item}
                  ratingProperty="severity"
                  ratingLabel="Schwere"
                />
              )}
            />
          </TabsContent>
          
          <TabsContent value="gains">
            <AIResultsPanel
              title="Kundenvorteile"
              items={storedAIResult.gains}
              onAddItems={onAddGains}
              renderItem={(item, index) => (
                <AIResultsItem 
                  key={index}
                  item={item}
                  ratingProperty="importance"
                  ratingLabel="Wichtigkeit"
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
