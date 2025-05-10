
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FunnelStagesProps {
  funnelData: any;
  onSaveFunnel: (data: any) => void;
  isLoading: boolean;
}

const FunnelStages: React.FC<FunnelStagesProps> = ({
  funnelData,
  onSaveFunnel,
  isLoading
}) => {
  const defaultStages = [
    {
      id: "awareness",
      name: "Awareness",
      description: "Introduce your brand to potential customers",
      touchpoints: ["Social media content", "Blog posts", "SEO optimization"]
    },
    {
      id: "interest",
      name: "Interest",
      description: "Build interest in your products or services",
      touchpoints: ["Email newsletters", "Webinars", "Detailed content"]
    },
    {
      id: "consideration",
      name: "Consideration",
      description: "Help customers evaluate your offering",
      touchpoints: ["Case studies", "Product demos", "Comparison guides"]
    },
    {
      id: "intent",
      name: "Intent",
      description: "Guide customers toward making a decision",
      touchpoints: ["Special offers", "Free trials", "Consultations"]
    },
    {
      id: "conversion",
      name: "Conversion",
      description: "Convert prospects into customers",
      touchpoints: ["Checkout optimization", "Clear CTAs", "Testimonials"]
    }
  ];

  const [stages, setStages] = useState(funnelData?.stages || defaultStages);

  const handleSave = () => {
    const updatedFunnel = {
      ...(funnelData || {}),
      stages,
      lastUpdated: new Date().toISOString()
    };
    onSaveFunnel(updatedFunnel);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading funnel stages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Funnel Stages</h3>
        <Button onClick={handleSave}>Save Stages</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {stages.map((stage, index) => (
          <Card key={stage.id} className="border-l-4" style={{ borderLeftColor: `hsl(${index * 60}, 70%, 50%)` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{stage.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{stage.description}</p>
              <div>
                <h4 className="text-sm font-medium mb-1">Key Touchpoints:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {stage.touchpoints.map((touchpoint, i) => (
                    <li key={i} className="text-sm">{touchpoint}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FunnelStages;
