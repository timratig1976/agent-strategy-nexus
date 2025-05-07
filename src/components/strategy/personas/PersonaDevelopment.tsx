
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PersonaDevelopmentProps } from "./types";
import { useAgentResultSaver } from "../briefing/hooks/useAgentResultSaver";
import { BriefingResult } from "../briefing/components/briefing-result/BriefingResult";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import PersonaEditor from "./PersonaEditor";

const PersonaDevelopment: React.FC<PersonaDevelopmentProps> = ({ 
  strategy, 
  agentResults = [],
  briefingAgentResult
}) => {
  const [briefingHistory, setBriefingHistory] = useState(agentResults.filter(r => 
    r.metadata?.type === 'briefing' || !r.metadata?.type));
  const [personaHistory, setPersonaHistory] = useState(agentResults.filter(r => 
    r.metadata?.type === 'persona'));
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);
  
  // Use our custom hook for saving results
  const { saveAgentResult } = useAgentResultSaver();
  
  // Find the latest briefing from the history or use the provided one
  const latestBriefing = briefingAgentResult || 
    (briefingHistory.length > 0 ? briefingHistory[0] : null);
  
  // Find the latest persona from the history
  const latestPersona = personaHistory.length > 0 ? personaHistory[0] : null;
  
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
      const { data: aiResponse, error: aiError, debugInfo } = await supabase.functions.invoke('marketing-ai', {
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
      setAiDebugInfo(debugInfo || { requestData: {}, responseData: aiResponse });
      
      if (aiError) {
        clearInterval(progressInterval);
        throw new Error(aiError);
      }
      
      if (aiResponse && aiResponse.result) {
        // Calculate the next version number
        const nextVersion = personaHistory.length > 0 ? 
          ((personaHistory[0].metadata?.version || 0) as number) + 1 : 1;
        
        // Create a timestamp for the generation
        const currentTime = new Date().toISOString();
        
        // Create the agent result to save to the database
        const newResult = {
          agent_id: null,
          strategy_id: strategy.id,
          content: aiResponse.result.rawOutput || "",
          metadata: {
            version: nextVersion,
            generated_at: currentTime,
            enhanced_with: enhancementText || undefined,
            type: 'persona'
          }
        };
        
        // Save the generated persona to the database
        const { data: savedResult, error } = await supabase
          .from('agent_results')
          .insert(newResult)
          .select()
          .single();
        
        clearInterval(progressInterval);
        setProgress(100);
        
        if (error) {
          console.error("Error saving new persona:", error);
          throw error;
        }
        
        if (savedResult) {
          // Format the saved result to match our AgentResult type
          const formattedResult = {
            id: savedResult.id,
            agentId: savedResult.agent_id,
            strategyId: savedResult.strategy_id,
            content: savedResult.content,
            createdAt: savedResult.created_at,
            metadata: (typeof savedResult.metadata === 'object' && savedResult.metadata !== null) 
              ? savedResult.metadata as Record<string, any>
              : {}
          };
          
          // Update local state
          setPersonaHistory(prev => [formattedResult, ...prev]);
        }
        
        toast.success("AI Persona generated successfully");
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
      
      const savedResult = await saveAgentResult(strategy.id, content, metadata);
      
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
          />
        </div>
      </div>
    </div>
  );
};

export default PersonaDevelopment;
