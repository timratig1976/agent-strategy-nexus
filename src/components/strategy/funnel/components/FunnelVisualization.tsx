
import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FunnelVisualizationProps {
  funnelData: any;
  isLoading: boolean;
}

const FunnelVisualization: React.FC<FunnelVisualizationProps> = ({
  funnelData,
  isLoading
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visualizationType, setVisualizationType] = useState<string>("classic");
  const [highlightedStage, setHighlightedStage] = useState<string | null>(null);
  const [conversionRates, setConversionRates] = useState<any>({});
  
  // Generate sample conversion rates if not provided
  useEffect(() => {
    if (!funnelData?.conversionRates && funnelData?.stages) {
      const sampleRates: any = {};
      let previousValue = 100;
      
      funnelData.stages.forEach((stage: any, index: number) => {
        if (index === 0) {
          sampleRates[stage.id] = previousValue;
        } else {
          // Randomly decrease by 20-50%
          const decrease = previousValue * (0.2 + Math.random() * 0.3);
          sampleRates[stage.id] = Math.round(previousValue - decrease);
          previousValue = sampleRates[stage.id];
        }
      });
      
      setConversionRates(sampleRates);
    } else if (funnelData?.conversionRates) {
      setConversionRates(funnelData.conversionRates);
    }
  }, [funnelData]);
  
  // Draw the funnel visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !funnelData?.stages || funnelData.stages.length === 0) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const stages = funnelData.stages;
    const numStages = stages.length;
    const stageHeight = canvas.height / numStages;
    
    // Calculate widths based on conversion rates or sample data
    const maxWidth = canvas.width * 0.8;
    const minWidth = canvas.width * 0.3;
    
    // Draw the funnel shape
    for (let i = 0; i < numStages; i++) {
      const stage = stages[i];
      const stageId = stage.id;
      
      // Calculate width based on conversion rate
      let width;
      if (conversionRates[stageId]) {
        width = minWidth + (maxWidth - minWidth) * (conversionRates[stageId] / 100);
      } else {
        // Fallback if no conversion rate
        width = maxWidth - ((maxWidth - minWidth) / numStages) * i;
      }
      
      const x = (canvas.width - width) / 2;
      const y = i * stageHeight;
      
      // Set colors based on visualization type and highlight
      let gradient;
      if (visualizationType === "classic") {
        gradient = ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, `hsl(${220 + i * 25}, 70%, ${highlightedStage === stageId ? '65%' : '50%'})`);
        gradient.addColorStop(1, `hsl(${220 + i * 25}, 70%, ${highlightedStage === stageId ? '45%' : '30%'})`);
      } else if (visualizationType === "modern") {
        gradient = ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, `rgba(99, 102, 241, ${highlightedStage === stageId ? '0.9' : '0.7'})`);
        gradient.addColorStop(1, `rgba(79, 70, 229, ${highlightedStage === stageId ? '0.9' : '0.7'})`);
      } else {
        // Heat map
        const intensity = conversionRates[stageId] ? conversionRates[stageId] / 100 : 1 - i / numStages;
        const hue = intensity * 120; // Red (0) to Green (120)
        ctx.fillStyle = `hsl(${hue}, 70%, ${highlightedStage === stageId ? '65%' : '50%'})`;
      }
      
      // Set fill style
      if (visualizationType !== "heatmap") {
        ctx.fillStyle = gradient;
      }
      
      // Draw trapezoid or rectangle
      ctx.beginPath();
      if (i === 0) {
        // First stage
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width * 0.9, y + stageHeight);
        ctx.lineTo(x + width * 0.1, y + stageHeight);
      } else if (i === numStages - 1) {
        // Last stage
        ctx.moveTo(x + width * 0.1, y);
        ctx.lineTo(x + width * 0.9, y);
        ctx.lineTo(x + width, y + stageHeight);
        ctx.lineTo(x, y + stageHeight);
      } else {
        // Middle stages
        const prevWidth = maxWidth - ((maxWidth - minWidth) / numStages) * (i - 1);
        const nextWidth = maxWidth - ((maxWidth - minWidth) / numStages) * (i + 1);
        
        const prevX = (canvas.width - prevWidth) / 2;
        const nextX = (canvas.width - nextWidth) / 2;
        
        ctx.moveTo(prevX + prevWidth * 0.1, y);
        ctx.lineTo(prevX + prevWidth * 0.9, y);
        ctx.lineTo(x + width * 0.9, y + stageHeight);
        ctx.lineTo(x + width * 0.1, y + stageHeight);
      }
      ctx.closePath();
      ctx.fill();
      
      // Add stroke
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(stage.name, canvas.width / 2, y + stageHeight / 2);
      
      // Add conversion rate if available
      if (conversionRates[stageId]) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "12px Arial";
        ctx.fillText(`${conversionRates[stageId]}%`, canvas.width / 2, y + stageHeight / 2 + 20);
      }
    }
  }, [funnelData, visualizationType, highlightedStage, conversionRates]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading funnel visualization...</span>
      </div>
    );
  }
  
  if (!funnelData || !funnelData.stages || funnelData.stages.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          No funnel data available. Please configure your funnel stages first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Funnel Visualization</h3>
        <Select 
          value={visualizationType}
          onValueChange={setVisualizationType}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Classic View</SelectItem>
            <SelectItem value="modern">Modern View</SelectItem>
            <SelectItem value="heatmap">Heat Map</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Funnel Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-md p-4 h-[500px] flex justify-center items-center">
                <canvas 
                  ref={canvasRef}
                  width={600}
                  height={450}
                  className="max-w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Funnel Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stages">
                <TabsList className="w-full">
                  <TabsTrigger value="stages" className="flex-1">Stages</TabsTrigger>
                  <TabsTrigger value="metrics" className="flex-1">Metrics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="stages" className="pt-4">
                  <div className="space-y-4">
                    {funnelData.stages.map((stage: any, index: number) => (
                      <div 
                        key={stage.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          highlightedStage === stage.id 
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-slate-100'
                        }`}
                        onClick={() => setHighlightedStage(stage.id === highlightedStage ? null : stage.id)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{stage.name}</h4>
                          <Badge variant={highlightedStage === stage.id ? "default" : "outline"}>
                            Stage {index + 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{stage.description}</p>
                        {conversionRates[stage.id] && (
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Conversion:</span> {conversionRates[stage.id]}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="metrics" className="pt-4">
                  <div className="space-y-4">
                    {funnelData.stages.map((stage: any) => (
                      <div key={`${stage.id}-metrics`} className="space-y-2">
                        <h4 className="font-medium">{stage.name}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {stage.keyMetrics.map((metric: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="p-1 px-2">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FunnelVisualization;
