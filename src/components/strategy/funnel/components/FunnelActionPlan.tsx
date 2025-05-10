
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Save, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ActionItem {
  id: string;
  title: string;
  description: string;
  stage: string;
  isCompleted: boolean;
  assignee?: string;
  dueDate?: string;
}

interface FunnelActionPlanProps {
  funnelData: any;
  onSaveFunnel: (data: any, isFinal?: boolean) => void;
  onFinalize: () => void;
  isFinalized: boolean;
  isLoading: boolean;
}

const FunnelActionPlan: React.FC<FunnelActionPlanProps> = ({
  funnelData,
  onSaveFunnel,
  onFinalize,
  isFinalized,
  isLoading
}) => {
  const stages = funnelData?.stages || [];
  
  // Generate default action items if none exist
  const defaultActionItems: ActionItem[] = stages.flatMap((stage: any) => [
    {
      id: `${stage.id}-content`,
      title: `Create content for ${stage.name} stage`,
      description: `Develop content that addresses the needs and questions of users in the ${stage.name.toLowerCase()} stage.`,
      stage: stage.id,
      isCompleted: false
    },
    {
      id: `${stage.id}-touchpoints`,
      title: `Set up ${stage.name} touchpoints`,
      description: `Implement the marketing touchpoints for the ${stage.name.toLowerCase()} stage of the funnel.`,
      stage: stage.id,
      isCompleted: false
    }
  ]);
  
  const [actionItems, setActionItems] = useState<ActionItem[]>(
    funnelData?.actionItems || defaultActionItems
  );
  
  const [newActionItem, setNewActionItem] = useState<Partial<ActionItem>>({
    title: "",
    description: "",
    stage: stages.length > 0 ? stages[0].id : ""
  });
  
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  
  // Group action items by stage
  const actionItemsByStage = stages.map((stage: any) => ({
    stage,
    items: actionItems.filter(item => item.stage === stage.id)
  }));
  
  const handleToggleComplete = (id: string) => {
    const updatedItems = actionItems.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setActionItems(updatedItems);
  };
  
  const handleAddActionItem = () => {
    if (!newActionItem.title) {
      toast.error("Please enter a title for the action item");
      return;
    }
    
    const newItem: ActionItem = {
      id: `action-${Date.now()}`,
      title: newActionItem.title || "",
      description: newActionItem.description || "",
      stage: newActionItem.stage || (stages.length > 0 ? stages[0].id : ""),
      isCompleted: false,
      assignee: newActionItem.assignee,
      dueDate: newActionItem.dueDate
    };
    
    const updatedItems = [...actionItems, newItem];
    setActionItems(updatedItems);
    
    // Reset form
    setNewActionItem({
      title: "",
      description: "",
      stage: stages.length > 0 ? stages[0].id : ""
    });
    setIsAddingNew(false);
    
    toast.success("Action item added");
  };
  
  const handleSaveActionPlan = () => {
    const updatedFunnel = {
      ...(funnelData || {}),
      actionItems,
      lastUpdated: new Date().toISOString()
    };
    onSaveFunnel(updatedFunnel);
    toast.success("Action plan saved");
  };
  
  const handleFinalize = () => {
    const completedCount = actionItems.filter(item => item.isCompleted).length;
    const totalCount = actionItems.length;
    const completionPercentage = (completedCount / totalCount) * 100;
    
    if (completionPercentage < 50) {
      const confirmFinalize = window.confirm(
        `Only ${Math.round(completionPercentage)}% of action items are completed. Are you sure you want to finalize the funnel strategy?`
      );
      
      if (!confirmFinalize) {
        return;
      }
    }
    
    onFinalize();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading action plan...</span>
      </div>
    );
  }
  
  if (!funnelData || stages.length === 0) {
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
        <h3 className="text-lg font-medium">Funnel Action Plan</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleSaveActionPlan}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Action Plan
          </Button>
          
          <Button 
            onClick={handleFinalize}
            disabled={isFinalized}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            {isFinalized ? "Finalized" : "Finalize Funnel Strategy"}
          </Button>
        </div>
      </div>
      
      {/* Action Items by Stage */}
      <div className="space-y-6">
        {actionItemsByStage.map(({ stage, items }) => (
          <Card key={stage.id} className={items.length === 0 ? "border-dashed" : ""}>
            <CardHeader 
              className="pb-2"
              style={{ 
                borderBottom: `1px solid rgba(0,0,0,0.1)`,
                borderLeft: `4px solid hsl(${220 + actionItemsByStage.findIndex(s => s.stage.id === stage.id) * 25}, 70%, 50%)`,
                borderRadius: '0.375rem 0.375rem 0 0'
              }}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{stage.name} Stage</CardTitle>
                <Badge variant="outline">
                  {items.filter(item => item.isCompleted).length}/{items.length} Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">
                  No action items for this stage yet
                </p>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-md border ${
                        item.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Switch
                            checked={item.isCompleted}
                            onCheckedChange={() => handleToggleComplete(item.id)}
                          />
                          <span className={item.isCompleted ? 'line-through text-muted-foreground' : 'font-medium'}>
                            {item.title}
                          </span>
                        </div>
                        {item.dueDate && (
                          <Badge variant="outline" className="ml-2">
                            Due: {item.dueDate}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-2 ml-9">
                          {item.description}
                        </p>
                      )}
                      {item.assignee && (
                        <div className="mt-2 ml-9 text-sm">
                          <span className="font-medium">Assignee:</span> {item.assignee}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new action item button for this stage */}
              {!isAddingNew && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingNew(true);
                    setNewActionItem({
                      ...newActionItem,
                      stage: stage.id
                    });
                  }}
                  className="mt-4 w-full border border-dashed text-muted-foreground"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add action item
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* New Action Item Form */}
      {isAddingNew && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Action Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item-title">Title</Label>
                <Input
                  id="item-title"
                  value={newActionItem.title}
                  onChange={(e) => setNewActionItem({...newActionItem, title: e.target.value})}
                  placeholder="Action item title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-description">Description</Label>
                <Textarea
                  id="item-description"
                  value={newActionItem.description}
                  onChange={(e) => setNewActionItem({...newActionItem, description: e.target.value})}
                  placeholder="Describe what needs to be done"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-stage">Funnel Stage</Label>
                  <select
                    id="item-stage"
                    value={newActionItem.stage}
                    onChange={(e) => setNewActionItem({...newActionItem, stage: e.target.value})}
                    className="w-full border border-input p-2 rounded-md"
                  >
                    {stages.map((stage: any) => (
                      <option key={stage.id} value={stage.id}>{stage.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="item-assignee">Assignee (Optional)</Label>
                  <Input
                    id="item-assignee"
                    value={newActionItem.assignee || ""}
                    onChange={(e) => setNewActionItem({...newActionItem, assignee: e.target.value})}
                    placeholder="Who is responsible"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-due-date">Due Date (Optional)</Label>
                <Input
                  id="item-due-date"
                  type="date"
                  value={newActionItem.dueDate || ""}
                  onChange={(e) => setNewActionItem({...newActionItem, dueDate: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddActionItem}>
                  Add Action Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FunnelActionPlan;
