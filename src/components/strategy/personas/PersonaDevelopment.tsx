
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PersonaDevelopmentProps } from "./types";
import { useAgentResultSaver } from "../briefing/hooks/useAgentResultSaver";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefingResult } from "../briefing/components/briefing-result/BriefingResult";
import PersonaEditor from "./PersonaEditor";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PersonaDevelopment: React.FC<PersonaDevelopmentProps> = ({ 
  strategy, 
  agentResults = [],
  briefingAgentResult
}) => {
  const navigate = useNavigate();
  const [briefingHistory, setBriefingHistory] = useState(agentResults.filter(r => 
    r.metadata?.type === 'briefing' || !r.metadata?.type));
  const [personaHistory, setPersonaHistory] = useState(agentResults.filter(r => 
    r.metadata?.type === 'persona'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);
  const [editedContent, setEditedContent] = useState("");
  const [enhancementText, setEnhancementText] = useState("");
  
  // Use our custom hook for saving results
  const { saveAgentResult: saveAgentResultToDb } = useAgentResultSaver();
  
  // Find the latest briefing from the history or use the provided one
  const latestBriefing = briefingAgentResult || 
    (briefingHistory.length > 0 ? briefingHistory[0] : null);
  
  // Find the latest persona from the history
  const latestPersona = personaHistory.length > 0 ? personaHistory[0] : null;

  // Handler for going back to the briefing step
  const handleGoToPreviousStep = () => {
    // Navigate back to strategy details with briefing state
    navigate(`/strategy/${strategy.id}?state=briefing`);
  };
  
  // Function to generate AI persona with progress updates
  const generatePersona = async (enhancementText?: string): Promise<void> => {
    try {
      if (!latestBriefing || !latestBriefing.content) {
        toast.error("Briefing content is required to generate personas");
        return;
      }
      
      setIsGenerating(true);
      setProgress(10);
      setAiDebugInfo(null); // Reset debug info
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 1000);
      
      // Generate the persona content using the AI service
      const { data: aiResponse, error: aiError } = await supabase.functions.invoke('marketing-ai', {
        body: { 
          module: 'persona', 
          action: 'generate',
          data: {
            strategyId: strategy.id,
            briefingContent: latestBriefing.content,
            enhancementText: enhancementText || ''
          }
        }
      });
      
      // Store debug info for monitoring
      if (aiResponse) {
        setAiDebugInfo(aiResponse);
      }
      
      if (aiError) {
        clearInterval(progressInterval);
        throw new Error(aiError.message);
      }
      
      if (aiResponse && aiResponse.result) {
        // Calculate the next version number
        const nextVersion = personaHistory.length > 0 ? 
          ((personaHistory[0].metadata?.version || 0) as number) + 1 : 1;
        
        // Create a timestamp for the generation
        const currentTime = new Date().toISOString();
        
        // Create metadata for the agent result
        const metadata = {
          version: nextVersion,
          generated_at: currentTime,
          enhanced_with: enhancementText || undefined,
          type: 'persona'
        };
        
        // Save the generated persona using our utility function
        const savedResult = await saveAgentResultToDb(
          strategy.id,
          aiResponse.result.rawOutput || "",
          metadata
        );
        
        clearInterval(progressInterval);
        setProgress(100);
        
        if (savedResult) {
          // Update local state with the new persona
          setPersonaHistory(prev => [savedResult, ...prev]);
          
          // Update the edited content for the editor
          setEditedContent(savedResult.content);
          
          toast.success("AI Persona generated successfully");
        }
      }
    } catch (error: any) {
      console.error("Error generating persona:", error);
      toast.error("Failed to generate AI persona");
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save persona agent result
  const savePersonaResult = async (content: string, isFinal?: boolean): Promise<void> => {
    if (!content.trim()) {
      toast.error("Cannot save empty content");
      return;
    }
    
    try {
      const metadata = {
        version: personaHistory.length > 0 ? 
          ((personaHistory[0].metadata?.version || 0) + 1) : 1,
        is_final: isFinal || false,
        saved_at: new Date().toISOString(),
        type: 'persona'
      };
      
      const savedResult = await saveAgentResultToDb(strategy.id, content, metadata);
      
      if (savedResult) {
        // Add to the local state
        setPersonaHistory(prev => [savedResult, ...prev]);
      }
    } catch (error) {
      console.error("Error saving persona:", error);
      throw error;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Briefing Information */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Strategy Briefing</CardTitle>
            </CardHeader>
            <CardContent>
              <PersonaEditor 
                content={latestBriefing?.content || "No briefing available"}
                readOnly={true}
              />
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleGoToPreviousStep}
                  className="flex items-center"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> 
                  Back to Briefing
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right side - Persona Generation */}
        <div>
          <BriefingResult 
            latestBriefing={latestPersona || null}
            isGenerating={isGenerating}
            progress={progress}
            generateBriefing={generatePersona}
            saveAgentResult={savePersonaResult}
            briefingHistory={personaHistory}
            setBriefingHistory={setPersonaHistory}
            aiDebugInfo={aiDebugInfo}
            customTitle="Persona Generator"
            generateButtonText="Generate Persona"
            saveButtonText="Save Persona Draft"
            saveFinalButtonText="Save Final Persona"
            placeholderText="Generated personas will appear here..."
          />
        </div>
      </div>
    </div>
  );
};

export default PersonaDevelopment;
