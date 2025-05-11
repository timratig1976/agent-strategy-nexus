
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Strategy } from "@/types/marketing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Import components for each stage
import { 
  AdCampaignStructure,
  AdCreativeGenerator,
  TargetAudienceBuilder,
  AdCampaignSettings,
  LandingPageDesigner
} from "./components";

interface AdCampaignModuleProps {
  strategy: Strategy;
  onNavigateBack: () => void;
}

const AdCampaignModule: React.FC<AdCampaignModuleProps> = ({
  strategy,
  onNavigateBack
}) => {
  const [activeTab, setActiveTab] = useState<string>("structure");
  const [campaignData, setCampaignData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Get saved campaign data on mount
  React.useEffect(() => {
    const loadCampaignData = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('agent_results')
          .select('*')
          .eq('strategy_id', strategy.id)
          .eq('metadata->>type', 'ad_campaign')
          .order('created_at', { ascending: false })
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          try {
            const parsedData = JSON.parse(data.content);
            setCampaignData(parsedData);
          } catch (e) {
            console.error("Error parsing campaign data:", e);
          }
        }
      } catch (err) {
        console.error("Error loading campaign data:", err);
        toast.error("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaignData();
  }, [strategy.id]);
  
  // Save campaign data
  const saveCampaignData = async (data: any, isFinal: boolean = false) => {
    try {
      setIsSaving(true);
      
      const content = JSON.stringify(data);
      
      const { error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategy.id,
          agent_id: null,
          content: content,
          metadata: {
            type: 'ad_campaign',
            is_final: isFinal,
            saved_at: new Date().toISOString()
          }
        });
        
      if (error) throw error;
      
      setCampaignData(data);
      toast.success("Campaign data saved successfully");
    } catch (err) {
      console.error("Error saving campaign data:", err);
      toast.error("Failed to save campaign data");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ad Campaign Strategy</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={onNavigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to ROAS Calculator
          </Button>
          
          <Button
            onClick={() => saveCampaignData(campaignData, true)}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Campaign"}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="structure" className="text-xs md:text-sm">1. Campaign Structure</TabsTrigger>
          <TabsTrigger value="audience" className="text-xs md:text-sm">2. Target Audience</TabsTrigger>
          <TabsTrigger value="creative" className="text-xs md:text-sm">3. Ad Creative</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs md:text-sm">4. Campaign Settings</TabsTrigger>
          <TabsTrigger value="landing" className="text-xs md:text-sm">5. Landing Pages</TabsTrigger>
        </TabsList>
        
        <Card className="mt-4">
          <CardContent className="pt-6">
            <TabsContent value="structure" className="m-0">
              <AdCampaignStructure 
                campaignData={campaignData} 
                onSaveCampaign={saveCampaignData} 
                strategyId={strategy.id}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="audience" className="m-0">
              <TargetAudienceBuilder 
                campaignData={campaignData} 
                onSaveCampaign={saveCampaignData} 
                strategyId={strategy.id}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="creative" className="m-0">
              <AdCreativeGenerator 
                campaignData={campaignData} 
                onSaveCampaign={saveCampaignData} 
                strategyId={strategy.id}
                funnelData={null} // Will be implemented later
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="m-0">
              <AdCampaignSettings 
                campaignData={campaignData} 
                onSaveCampaign={saveCampaignData} 
                strategyId={strategy.id}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="landing" className="m-0">
              <LandingPageDesigner 
                campaignData={campaignData} 
                onSaveCampaign={saveCampaignData} 
                strategyId={strategy.id}
                isLoading={isLoading}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AdCampaignModule;
