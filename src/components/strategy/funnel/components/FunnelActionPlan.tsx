
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FunnelStage, FunnelTouchpoint } from "../types";
import { Loader2 } from "lucide-react";

interface FunnelActionPlanProps {
  stages: FunnelStage[];
  onSave: (actionPlans: Record<string, string>) => void;
  savedActionPlan?: Record<string, string>;
  isLoading: boolean;
}

const FunnelActionPlan: React.FC<FunnelActionPlanProps> = ({
  stages,
  onSave,
  savedActionPlan = {},
  isLoading
}) => {
  const [actionPlans, setActionPlans] = useState<Record<string, string>>(savedActionPlan);
  const [activeTab, setActiveTab] = useState<string>("");
  
  // Set the active tab to the first stage when stages change
  useEffect(() => {
    if (stages.length > 0 && !activeTab) {
      setActiveTab(stages[0].id);
    }
  }, [stages, activeTab]);
  
  // Update local state when saved action plan changes
  useEffect(() => {
    setActionPlans(savedActionPlan || {});
  }, [savedActionPlan]);
  
  const handleActionPlanChange = (stageId: string, text: string) => {
    setActionPlans(prev => ({
      ...prev,
      [stageId]: text
    }));
  };
  
  const handleSave = () => {
    onSave(actionPlans);
  };
  
  if (stages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnel Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please define your funnel stages first before creating action plans.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Action Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Define specific actions and strategies for each stage of your marketing funnel.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {stages.map(stage => (
              <TabsTrigger key={stage.id} value={stage.id}>
                {stage.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {stages.map(stage => (
            <TabsContent key={stage.id} value={stage.id} className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2">{stage.name} Stage Action Plan</h3>
                <Textarea
                  placeholder={`Define the action plan for the ${stage.name} stage...`}
                  rows={8}
                  value={actionPlans[stage.id] || ''}
                  onChange={(e) => handleActionPlanChange(stage.id, e.target.value)}
                  className="w-full"
                />
              </div>
              
              {stage.touchPoints && stage.touchPoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Touchpoints to Consider:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {stage.touchPoints.map(touchpoint => (
                      <li key={touchpoint.id}>{touchpoint.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Action Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelActionPlan;
