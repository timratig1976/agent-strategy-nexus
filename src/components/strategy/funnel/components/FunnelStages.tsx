
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { toast } from "sonner";

// Define the Funnel Stage type
interface FunnelStage {
  id: string;
  name: string;
  description: string;
  keyMetrics: string[];
  touchpoints: string[];
}

interface FunnelStagesProps {
  funnelData: any;
  onSaveFunnel: (data: any, isFinal?: boolean) => void;
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
      description: "Potential customers become aware of your product or service.",
      keyMetrics: ["Impressions", "Reach", "Brand Awareness"],
      touchpoints: ["Social Media", "Content Marketing", "PR"]
    },
    {
      id: "interest",
      name: "Interest",
      description: "Prospects show interest and want to learn more.",
      keyMetrics: ["Engagement Rate", "Time on Page", "Social Shares"],
      touchpoints: ["Blog Content", "Email Newsletters", "Social Media Engagement"]
    },
    {
      id: "consideration",
      name: "Consideration",
      description: "Prospects actively evaluate your offering against alternatives.",
      keyMetrics: ["Return Visits", "Email Open Rates", "Content Downloads"],
      touchpoints: ["Case Studies", "Webinars", "Product Demos"]
    },
    {
      id: "conversion",
      name: "Conversion",
      description: "Prospects become customers by taking the desired action.",
      keyMetrics: ["Conversion Rate", "Cost Per Acquisition", "Sales"],
      touchpoints: ["Landing Pages", "Sales Calls", "E-commerce"]
    },
    {
      id: "loyalty",
      name: "Loyalty",
      description: "Customers become repeat buyers and advocates.",
      keyMetrics: ["Repeat Purchase Rate", "Referrals", "Customer Lifetime Value"],
      touchpoints: ["Customer Support", "Loyalty Programs", "Community Building"]
    }
  ];

  const [stages, setStages] = useState<FunnelStage[]>(
    (funnelData?.stages || defaultStages).map((stage: any) => ({
      ...stage,
      keyMetrics: stage.keyMetrics || [],
      touchpoints: stage.touchpoints || []
    }))
  );
  
  // State for new metric/touchpoint inputs
  const [newMetrics, setNewMetrics] = useState<{[key: string]: string}>({});
  const [newTouchpoints, setNewTouchpoints] = useState<{[key: string]: string}>({});
  
  // Save stages to funnel data
  const handleSave = () => {
    const updatedFunnel = {
      ...(funnelData || {}),
      stages: stages,
      lastUpdated: new Date().toISOString()
    };
    onSaveFunnel(updatedFunnel);
  };
  
  // Add a new custom stage
  const addStage = () => {
    const newStage: FunnelStage = {
      id: `stage-${Date.now()}`,
      name: "New Stage",
      description: "Describe this funnel stage",
      keyMetrics: [],
      touchpoints: []
    };
    
    setStages([...stages, newStage]);
  };
  
  // Remove a stage
  const removeStage = (index: number) => {
    const updatedStages = [...stages];
    updatedStages.splice(index, 1);
    setStages(updatedStages);
  };
  
  // Update stage details
  const updateStage = (index: number, field: keyof FunnelStage, value: any) => {
    const updatedStages = [...stages];
    updatedStages[index] = {
      ...updatedStages[index],
      [field]: value
    };
    setStages(updatedStages);
  };
  
  // Add a metric to a stage
  const addMetric = (stageIndex: number) => {
    if (!newMetrics[stages[stageIndex].id]) {
      toast.error("Please enter a metric first");
      return;
    }
    
    const updatedStages = [...stages];
    updatedStages[stageIndex].keyMetrics = [
      ...updatedStages[stageIndex].keyMetrics,
      newMetrics[stages[stageIndex].id]
    ];
    
    setStages(updatedStages);
    
    // Clear input
    const updatedNewMetrics = { ...newMetrics };
    delete updatedNewMetrics[stages[stageIndex].id];
    setNewMetrics(updatedNewMetrics);
  };
  
  // Remove a metric from a stage
  const removeMetric = (stageIndex: number, metricIndex: number) => {
    const updatedStages = [...stages];
    updatedStages[stageIndex].keyMetrics.splice(metricIndex, 1);
    setStages(updatedStages);
  };
  
  // Add a touchpoint to a stage
  const addTouchpoint = (stageIndex: number) => {
    if (!newTouchpoints[stages[stageIndex].id]) {
      toast.error("Please enter a touchpoint first");
      return;
    }
    
    const updatedStages = [...stages];
    updatedStages[stageIndex].touchpoints = [
      ...updatedStages[stageIndex].touchpoints,
      newTouchpoints[stages[stageIndex].id]
    ];
    
    setStages(updatedStages);
    
    // Clear input
    const updatedNewTouchpoints = { ...newTouchpoints };
    delete updatedNewTouchpoints[stages[stageIndex].id];
    setNewTouchpoints(updatedNewTouchpoints);
  };
  
  // Remove a touchpoint from a stage
  const removeTouchpoint = (stageIndex: number, touchpointIndex: number) => {
    const updatedStages = [...stages];
    updatedStages[stageIndex].touchpoints.splice(touchpointIndex, 1);
    setStages(updatedStages);
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(stages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setStages(items);
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
        <div className="flex space-x-2">
          <Button onClick={addStage} size="sm" variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Stage
          </Button>
          <Button onClick={handleSave} size="sm" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Stages
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground mb-4">
        Drag and drop stages to reorder them in your funnel. Each stage should represent a step in your customer's journey.
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="funnel-stages">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {stages.map((stage, index) => (
                <Draggable key={stage.id} draggableId={stage.id} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border-l-4"
                      style={{
                        ...provided.draggableProps.style,
                        borderLeftColor: `hsl(${220 + index * 25}, 70%, 60%)`
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <Input
                            value={stage.name}
                            onChange={(e) => updateStage(index, 'name', e.target.value)}
                            className="text-lg font-semibold h-8 w-48"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeStage(index)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            value={stage.description}
                            onChange={(e) => updateStage(index, 'description', e.target.value)}
                            className="mt-1"
                            rows={2}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Key Metrics</label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {stage.keyMetrics.map((metric, metricIndex) => (
                              <div 
                                key={`${stage.id}-metric-${metricIndex}`}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center gap-1"
                              >
                                <span className="text-sm">{metric}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-4 w-4 p-0 hover:bg-blue-200"
                                  onClick={() => removeMetric(index, metricIndex)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div className="flex mt-2 gap-2">
                            <Input
                              value={newMetrics[stage.id] || ''}
                              onChange={(e) => setNewMetrics({
                                ...newMetrics,
                                [stage.id]: e.target.value
                              })}
                              placeholder="Add a key metric"
                              className="text-sm"
                            />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => addMetric(index)}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Touchpoints</label>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {stage.touchpoints.map((touchpoint, touchpointIndex) => (
                              <div 
                                key={`${stage.id}-touchpoint-${touchpointIndex}`}
                                className="bg-green-100 text-green-800 px-2 py-1 rounded-md flex items-center gap-1"
                              >
                                <span className="text-sm">{touchpoint}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-4 w-4 p-0 hover:bg-green-200"
                                  onClick={() => removeTouchpoint(index, touchpointIndex)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div className="flex mt-2 gap-2">
                            <Input
                              value={newTouchpoints[stage.id] || ''}
                              onChange={(e) => setNewTouchpoints({
                                ...newTouchpoints,
                                [stage.id]: e.target.value
                              })}
                              placeholder="Add a touchpoint"
                              className="text-sm"
                            />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => addTouchpoint(index)}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default FunnelStages;
