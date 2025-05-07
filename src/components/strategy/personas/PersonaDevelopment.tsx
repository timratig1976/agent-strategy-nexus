
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PersonaDevelopmentProps } from "./types";
import { useAgentResultSaver } from "../briefing/hooks/useAgentResultSaver";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefingResult } from "../briefing/components/briefing-result/BriefingResult";
import PersonaEditor from "./PersonaEditor";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MarketingAIService } from "@/services/marketingAIService";

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
  const [hasFinalPersona, setHasFinalPersona] = useState(false);
  
  // Use our custom hook for saving results
  const { saveAgentResult: saveAgentResultToDb } = useAgentResultSaver();
  
  // Find the latest briefing from the history or use the provided one
  const latestBriefing = briefingAgentResult || 
    (briefingHistory.length > 0 ? briefingHistory[0] : null);
  
  // Find the latest persona from the history
  const latestPersona = personaHistory.length > 0 ? personaHistory[0] : null;

  // Check for final persona on mount and when persona history changes
  useEffect(() => {
    const finalPersona = personaHistory.find(persona => 
      persona.metadata?.is_final === true
    );
    setHasFinalPersona(!!finalPersona);
  }, [personaHistory]);

  // Handler for going back to the briefing step
  const handleGoToPreviousStep = async () => {
    try {
      console.log("Going back to briefing step for strategy:", strategy.id);
      
      // First update the strategy state back to briefing
      const { data, error } = await supabase
        .from('strategies')
        .update({ state: 'briefing' })
        .eq('id', strategy.id)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to go back to briefing stage");
        return;
      }
      
      console.log("Strategy state updated successfully:", data);
      toast.success("Returned to Briefing stage");
      
      // Then navigate back to the strategy details page
      navigate(`/strategy-details/${strategy.id}`);
    } catch (err) {
      console.error("Failed to go back to briefing:", err);
      toast.error("Failed to go back to briefing stage");
    }
  };

  // Handler for going to the next step (pain_gains)
  const handleGoToNextStep = async () => {
    try {
      console.log("Going to pain_gains step for strategy:", strategy.id);
      
      // Update the strategy state to pain_gains
      const { data, error } = await supabase
        .from('strategies')
        .update({ state: 'pain_gains' })
        .eq('id', strategy.id)
        .select();
      
      if (error) {
        console.error("Error updating strategy state:", error);
        toast.error("Failed to move to USP Canvas step");
        return;
      }
      
      console.log("Strategy state updated successfully:", data);
      toast.success("Moving to USP Canvas step");
      
      // Navigate to the strategy details page
      navigate(`/strategy-details/${strategy.id}`);
    } catch (err) {
      console.error("Failed to move to next step:", err);
      toast.error("Failed to move to USP Canvas step");
    }
  };
  
  // Function to generate AI persona with progress updates and using custom prompts
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
      
      console.log("Generating persona using custom AI prompts...");
      
      // Generate the persona content using the AI service with custom prompts
      const { data: aiResponse, error: aiError, debugInfo } = await MarketingAIService.generateContent<{ rawOutput: string }>(
        'persona',
        'generate',
        {
          strategyId: strategy.id,
          briefingContent: latestBriefing.content,
          enhancementText: enhancementText || ''
        }
      );
      
      // Store debug info for monitoring
      setAiDebugInfo(debugInfo);
      
      if (aiError) {
        clearInterval(progressInterval);
        throw new Error(aiError);
      }
      
      console.log("Generated persona data:", aiResponse);
      
      if (aiResponse) {
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
          aiResponse.rawOutput || "",
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
        
        // Update the final persona status if this is a final version
        if (isFinal) {
          setHasFinalPersona(true);
        }
      }
    } catch (error) {
      console.error("Error saving persona:", error);
      throw error;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with navigation buttons */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Persona Development</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleGoToPreviousStep}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Briefing
          </Button>
          {hasFinalPersona && (
            <Button
              onClick={handleGoToNextStep}
              className="flex items-center gap-2"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

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
            onBriefingSaved={(isFinal) => {
              if (isFinal) setHasFinalPersona(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonaDevelopment;
