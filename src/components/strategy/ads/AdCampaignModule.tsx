
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Strategy } from "@/types/marketing";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdCampaignSettings from "./components/AdCampaignSettings";
import TargetAudienceBuilder from "./components/TargetAudienceBuilder";
import AdCreativeGenerator from "./components/AdCreativeGenerator";
import LandingPageDesigner from "./components/LandingPageDesigner";
import AdCampaignStructure from "./components/AdCampaignStructure";
import { supabase } from "@/integrations/supabase/client";
import { StrategyDebugPanel } from "@/components/strategy/debug";
import { useStrategyDebug } from "@/hooks/useStrategyDebug";

interface AdCampaignModuleProps {
  strategy: Strategy;
  onNavigateBack?: () => void;
}

const AdCampaignModule: React.FC<AdCampaignModuleProps> = ({ 
  strategy,
  onNavigateBack 
}) => {
  const [activeTab, setActiveTab] = useState<string>("settings");
  const [campaignData, setCampaignData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setLocalDebugInfo] = useState<any>(null);

  // Use our strategy debug hook
  const { isDebugEnabled, setDebugInfo } = useStrategyDebug();
  
  // Load campaign data on initial render
  useEffect(() => {
    const loadCampaignData = async () => {
      if (!strategy.id) return;
      
      try {
        setIsLoading(true);
        
        // Use the correct table name that we just created in the database
        const { data, error } = await supabase
          .from('ad_campaigns')
          .select('*')
          .eq('strategy_id', strategy.id)
          .single();
          
        if (error) {
          if (error.code !== 'PGRST116') { // Not found error is ok for new campaigns
            console.error("Error loading campaign data:", error);
          }
          
          // Set default campaign data
          setCampaignData({
            settings: {
              name: `Campaign for ${strategy.name}`,
              platform: 'meta',
              budget: 1000,
              duration: 30
            },
            audience: {},
            creative: {},
            landingPage: {},
            structure: {}
          });
        } else if (data) {
          // Parse the JSONB content field
          setCampaignData(data.content || {});
          
          // Store debug info
          const loadDebugInfo = {
            type: 'ad_campaign_load',
            timestamp: new Date().toISOString(),
            data: data,
            success: true
          };
          
          setLocalDebugInfo(loadDebugInfo);
          
          if (isDebugEnabled) {
            setDebugInfo(loadDebugInfo);
          }
        }
      } catch (err) {
        console.error("Exception loading campaign data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaignData();
  }, [strategy.id, isDebugEnabled, setDebugInfo]);

  // Update debug info when it changes
  useEffect(() => {
    if (isDebugEnabled && debugInfo) {
      setDebugInfo(debugInfo);
    }
  }, [isDebugEnabled, debugInfo, setDebugInfo]);

  const handleSave = async (tabData: any, tabName: string) => {
    if (!strategy.id) return;
    
    try {
      const updatedCampaignData = {
        ...campaignData,
        [tabName]: tabData
      };
      
      const savePayload = {
        strategy_id: strategy.id,
        content: updatedCampaignData
      };
      
      const debugPayload = {
        type: 'ad_campaign_save',
        timestamp: new Date().toISOString(),
        requestData: savePayload
      };
      
      setLocalDebugInfo(debugPayload);
      
      // Check if record exists
      const { data: existing, error: checkError } = await supabase
        .from('ad_campaigns')
        .select('id')
        .eq('strategy_id', strategy.id)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking campaign existence:', checkError);
        throw new Error(checkError.message);
      }
      
      let result;
      
      if (existing) {
        // Update existing record
        result = await supabase
          .from('ad_campaigns')
          .update(savePayload)
          .eq('strategy_id', strategy.id);
      } else {
        // Insert new record
        result = await supabase
          .from('ad_campaigns')
          .insert(savePayload);
      }
      
      if (result.error) {
        console.error("Error saving campaign data:", result.error);
        throw new Error(result.error.message);
      }
      
      // Update local state
      setCampaignData(updatedCampaignData);
      
      // Update debug info with success
      const successPayload = {
        ...debugPayload,
        success: true,
        responseData: { status: 'success' }
      };
      
      setLocalDebugInfo(successPayload);
      
      if (isDebugEnabled) {
        setDebugInfo(successPayload);
      }
      
      return true;
    } catch (err: any) {
      console.error("Error saving campaign data:", err);
      
      // Update debug info with error
      const errorPayload = {
        type: 'ad_campaign_save',
        timestamp: new Date().toISOString(),
        error: err.message,
        success: false
      };
      
      setLocalDebugInfo(errorPayload);
      
      if (isDebugEnabled) {
        setDebugInfo(errorPayload);
      }
      
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNavigateBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Strategy
        </Button>
        <h2 className="text-2xl font-bold">Ad Campaign</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
              <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings">
              <AdCampaignSettings 
                data={campaignData.settings || {}}
                onSave={(data) => handleSave(data, 'settings')}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="audience">
              <TargetAudienceBuilder 
                data={campaignData.audience || {}}
                strategy={strategy}
                onSave={(data) => handleSave(data, 'audience')}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="creative">
              <AdCreativeGenerator 
                data={campaignData.creative || {}}
                strategy={strategy}
                onSave={(data) => handleSave(data, 'creative')}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="landing-page">
              <LandingPageDesigner 
                data={campaignData.landingPage || {}}
                strategy={strategy}
                onSave={(data) => handleSave(data, 'landingPage')}
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="structure">
              <AdCampaignStructure 
                data={campaignData.structure || {}}
                campaign={campaignData}
                strategy={strategy}
                onSave={(data) => handleSave(data, 'structure')}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Debug panel */}
      {isDebugEnabled && debugInfo && (
        <StrategyDebugPanel 
          debugInfo={debugInfo} 
          title="Ad Campaign Debug Information" 
        />
      )}
    </div>
  );
};

export default AdCampaignModule;
