
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TouchPoint {
  id: string;
  name: string;
}

interface FunnelStage {
  id: string;
  name: string;
  touchpoints: TouchPoint[];
}

interface FunnelData {
  stages: FunnelStage[];
  actionPlans?: Record<string, string>;
}

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
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateActionPlans = async () => {
    if (!strategyId || funnelData.stages.length === 0) {
      toast.error("Please create funnel stages first");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Fetch strategy metadata
      const { data: metadataResult, error: metadataError } = await supabase.rpc(
        'get_strategy_metadata',
        { strategy_id_param: strategyId }
      );
      
      if (metadataError) throw metadataError;
      
      const metadata = metadataResult[0];
      
      // In a real implementation, we would call an AI function here
      // For now, let's simulate generating action plans
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedActionPlans: Record<string, string> = {};
      
      funnelData.stages.forEach(stage => {
        const touchpointsList = stage.touchpoints.map(tp => tp.name).join(", ");
        
        generatedActionPlans[stage.id] = 
          `# ${stage.name} Stage Action Plan\n\n` +
          `For ${metadata?.company_name || 'your company'}, this stage focuses on ` +
          `${stage.name.toLowerCase()} activities.\n\n` +
          `## Key Touchpoints:\n` +
          (stage.touchpoints.length > 0 
            ? stage.touchpoints.map(tp => `- ${tp.name}: Implement strategies for engagement\n`).join("")
            : "- No touchpoints defined yet\n") +
          `\n## Recommended Actions:\n` +
          `1. Develop content targeting this stage of the customer journey\n` +
          `2. Set up analytics to track conversion through this stage\n` +
          `3. Create specific CTAs for each touchpoint\n\n` +
          `## Success Metrics:\n` +
          `- Engagement rate\n` +
          `- Conversion to next stage\n` +
          `- Customer feedback`;
      });
      
      // Save the generated action plans
      const newData = { ...funnelData, actionPlans: generatedActionPlans };
      
      // Mark existing final results as non-final
      await supabase.rpc('update_agent_results_final_status', {
        strategy_id_param: strategyId,
        result_type_param: 'funnel'
      });
      
      // Save the new funnel data
      const { error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          content: JSON.stringify(newData),
          metadata: {
            type: 'funnel',
            is_final: true,
            updated_at: new Date().toISOString(),
            ai_generated: true
          }
        });
      
      if (error) throw error;
      
      toast.success("Action plans generated successfully");
      onGenerateComplete();
    } catch (err) {
      console.error("Error generating action plans:", err);
      toast.error("Failed to generate action plans");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Funnel Planner</CardTitle>
        <CardDescription>
          Generate detailed action plans for each stage of your marketing funnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-md border border-dashed">
          <Wand2 className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-medium mb-2">Generate Action Plans with AI</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Our AI will analyze your funnel structure and create detailed action plans for each stage based on best practices.
          </p>
          <Button
            onClick={handleGenerateActionPlans}
            disabled={isGenerating || funnelData.stages.length === 0}
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Action Plans
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelAIGenerator;
