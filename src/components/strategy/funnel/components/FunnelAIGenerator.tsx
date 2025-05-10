import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { FunnelData } from "../types";

interface FunnelAIGeneratorProps {
  strategyId: string;
  funnelData: FunnelData;
  onGenerateComplete: () => void;
}

const FunnelAIGenerator: React.FC<FunnelAIGeneratorProps> = ({
  strategyId,
  funnelData,
  onGenerateComplete
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const handleGenerate = async () => {
    if (!strategyId || !prompt.trim()) return;
    
    try {
      setIsGenerating(true);
      
      // Send the generation request to the backend
      // This is a placeholder for the actual implementation
      // In a real implementation, you would call an API endpoint or use a service
      
      // Mock the generation process with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Save the result to the database
      await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          content: JSON.stringify({
            ...funnelData,
            // In a real implementation, this would be the generated content
          }),
          metadata: {
            type: 'funnel',
            is_final: true,
            updated_at: new Date().toISOString()
          }
        });
      
      toast.success("Funnel generated successfully!");
      setPrompt("");
      onGenerateComplete();
    } catch (error) {
      console.error("Error generating funnel:", error);
      toast.error("Failed to generate funnel");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
          AI Funnel Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use AI to help you generate or refine your funnel strategy. Provide specific requirements or challenges for better results.
          </p>
          
          <Textarea
            placeholder="E.g., Generate a B2B SaaS funnel focused on lead generation with content marketing..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
          
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Funnel Strategy
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelAIGenerator;
