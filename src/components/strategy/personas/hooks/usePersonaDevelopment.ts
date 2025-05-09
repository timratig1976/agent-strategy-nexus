
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AgentResult } from "@/types/marketing";
import { useAgentResultSaver } from "../../briefing/hooks/useAgentResultSaver";
import { MarketingAIService } from "@/services/marketingAIService";

export const usePersonaDevelopment = (strategyId: string, agentResults: AgentResult[] = []) => {
  // State for briefing and persona data
  const [briefingHistory, setBriefingHistory] = useState<AgentResult[]>(
    agentResults.filter(r => r.metadata?.type === 'briefing' || !r.metadata?.type)
  );
  const [personaHistory, setPersonaHistory] = useState<AgentResult[]>(
    agentResults.filter(r => r.metadata?.type === 'persona')
  );
  
  // State for AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);
  
  // State for editing
  const [editedContent, setEditedContent] = useState("");
  const [enhancementText, setEnhancementText] = useState("");
  const [hasFinalPersona, setHasFinalPersona] = useState(false);
  
  // Use our custom hook for saving results
  const { saveAgentResult: saveAgentResultToDb } = useAgentResultSaver();
  
  // Find the latest persona from the history
  const latestPersona = personaHistory.length > 0 ? personaHistory[0] : null;

  // Check for final persona on mount and when persona history changes
  useEffect(() => {
    const finalPersona = personaHistory.find(persona => 
      persona.metadata?.is_final === true
    );
    setHasFinalPersona(!!finalPersona);
  }, [personaHistory]);
  
  // Function to generate AI persona with progress updates and using custom prompts
  const generatePersona = async (enhancementText?: string): Promise<void> => {
    try {
      const latestBriefing = briefingHistory.length > 0 ? briefingHistory[0] : null;
      
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
          strategyId,
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
          strategyId,
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
      
      const savedResult = await saveAgentResultToDb(strategyId, content, metadata);
      
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
  
  return {
    briefingHistory,
    personaHistory,
    setPersonaHistory,
    latestPersona,
    isGenerating,
    progress,
    aiDebugInfo,
    editedContent,
    setEditedContent,
    enhancementText,
    setEnhancementText,
    hasFinalPersona,
    generatePersona,
    savePersonaResult
  };
};
