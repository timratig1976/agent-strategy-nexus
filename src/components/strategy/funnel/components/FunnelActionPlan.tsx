
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FunnelStage {
  id: string;
  name: string;
  touchpoints: {
    id: string;
    name: string;
  }[];
}

interface FunnelActionPlanProps {
  stages: FunnelStage[];
  onSave: (actionPlan: Record<string, string>) => void;
  savedActionPlan?: Record<string, string>;
  isLoading?: boolean;
}

const FunnelActionPlan: React.FC<FunnelActionPlanProps> = ({
  stages,
  onSave,
  savedActionPlan = {},
  isLoading = false,
}) => {
  const [actionPlans, setActionPlans] = useState<Record<string, string>>(savedActionPlan);
  const [activeTab, setActiveTab] = useState<string>(stages[0]?.id || "");

  const handleTextChange = (stageId: string, text: string) => {
    setActionPlans({
      ...actionPlans,
      [stageId]: text,
    });
  };

  const handleSave = () => {
    onSave(actionPlans);
    toast.success("Action plans saved successfully");
  };

  if (stages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnel Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please configure your funnel stages first.
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full">
            {stages.map((stage) => (
              <TabsTrigger key={stage.id} value={stage.id} className="flex-1">
                {stage.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {stages.map((stage) => (
            <TabsContent key={stage.id} value={stage.id} className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">{stage.name} Stage Plan</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create an action plan for the {stage.name.toLowerCase()} stage of your funnel.
                </p>
                
                <div className="mb-4">
                  <Textarea
                    placeholder={`Enter your action plan for the ${stage.name} stage...`}
                    className="min-h-[200px]"
                    value={actionPlans[stage.id] || ""}
                    onChange={(e) => handleTextChange(stage.id, e.target.value)}
                  />
                </div>
                
                <h4 className="text-sm font-medium mb-2">Touchpoints in this stage:</h4>
                <ul className="list-disc list-inside mb-4 pl-2">
                  {stage.touchpoints.length > 0 ? (
                    stage.touchpoints.map((tp) => (
                      <li key={tp.id} className="text-sm">{tp.name}</li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No touchpoints defined</li>
                  )}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6">
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Action Plan"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelActionPlan;
