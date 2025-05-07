
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  RotateCw, 
  CheckCircle2, 
  PlusCircle, 
  Settings,
  MessageSquareText 
} from "lucide-react";
import { toast } from "sonner";
import { 
  MarketingAIService, 
  UspCanvasAIResult, 
  UspCanvasJob,
  UspCanvasPain,
  UspCanvasGain 
} from "@/services/marketingAIService";
import AIDebugPanel from "@/components/shared/AIDebugPanel";
import { AIPromptSettings } from "@/components/strategy/briefing/components/AIPromptSettings";

interface UspCanvasAIGeneratorProps {
  strategyId: string;
  briefingContent: string;
  onAddJobs?: (jobs: UspCanvasJob[]) => void;
  onAddPains?: (pains: UspCanvasPain[]) => void;
  onAddGains?: (gains: UspCanvasGain[]) => void;
}

export const UspCanvasAIGenerator: React.FC<UspCanvasAIGeneratorProps> = ({
  strategyId,
  briefingContent,
  onAddJobs,
  onAddPains,
  onAddGains
}) => {
  const [activeTab, setActiveTab] = useState<string>("generate");
  const [activeSection, setActiveSection] = useState<string>("all");
  const [enhancementText, setEnhancementText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [aiResult, setAiResult] = useState<UspCanvasAIResult | null>(null);
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);

  // Handle generation of USP Canvas profile elements
  const handleGenerate = async () => {
    if (!strategyId || !briefingContent) {
      toast.error("Strategy ID and briefing content are required to generate USP Canvas elements");
      return;
    }

    setIsGenerating(true);
    setProgress(10);
    setAiResult(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 1000);

    try {
      // Generate based on the selected section
      let section: 'jobs' | 'pains' | 'gains' | undefined = undefined;
      
      if (activeSection === "jobs") section = "jobs";
      else if (activeSection === "pains") section = "pains";
      else if (activeSection === "gains") section = "gains";
      
      const { data, error, debugInfo } = await MarketingAIService.generateUspCanvasProfile(
        strategyId,
        briefingContent,
        section,
        enhancementText
      );

      // Store debug info
      setAiDebugInfo(debugInfo);

      if (error) {
        clearInterval(progressInterval);
        toast.error(`Failed to generate USP Canvas profile: ${error}`);
        setProgress(0);
        setIsGenerating(false);
        return;
      }

      if (data) {
        setAiResult(data);
        clearInterval(progressInterval);
        setProgress(100);
        toast.success("USP Canvas profile elements generated successfully");
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error generating USP Canvas profile:", error);
      toast.error("An unexpected error occurred while generating USP Canvas elements");
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle adding selected jobs to the canvas
  const handleAddJobs = (selectedJobs: UspCanvasJob[]) => {
    if (onAddJobs && selectedJobs.length > 0) {
      onAddJobs(selectedJobs);
      toast.success(`${selectedJobs.length} job(s) added to canvas`);
    }
  };

  // Handle adding selected pains to the canvas
  const handleAddPains = (selectedPains: UspCanvasPain[]) => {
    if (onAddPains && selectedPains.length > 0) {
      onAddPains(selectedPains);
      toast.success(`${selectedPains.length} pain(s) added to canvas`);
    }
  };

  // Handle adding selected gains to the canvas
  const handleAddGains = (selectedGains: UspCanvasGain[]) => {
    if (onAddGains && selectedGains.length > 0) {
      onAddGains(selectedGains);
      toast.success(`${selectedGains.length} gain(s) added to canvas`);
    }
  };

  // Handle adding all generated elements to the canvas
  const handleAddAll = () => {
    if (aiResult?.jobs && aiResult.jobs.length > 0 && onAddJobs) {
      onAddJobs(aiResult.jobs);
    }
    
    if (aiResult?.pains && aiResult.pains.length > 0 && onAddPains) {
      onAddPains(aiResult.pains);
    }
    
    if (aiResult?.gains && aiResult.gains.length > 0 && onAddGains) {
      onAddGains(aiResult.gains);
    }
    
    toast.success("All generated elements added to canvas");
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="settings">Prompt Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate USP Canvas Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select section to generate
                </label>
                <div className="flex space-x-2">
                  <Button
                    variant={activeSection === "all" ? "default" : "outline"}
                    onClick={() => setActiveSection("all")}
                    className="flex-1"
                  >
                    All Sections
                  </Button>
                  <Button
                    variant={activeSection === "jobs" ? "default" : "outline"}
                    onClick={() => setActiveSection("jobs")}
                    className="flex-1"
                  >
                    Jobs
                  </Button>
                  <Button
                    variant={activeSection === "pains" ? "default" : "outline"}
                    onClick={() => setActiveSection("pains")}
                    className="flex-1"
                  >
                    Pains
                  </Button>
                  <Button
                    variant={activeSection === "gains" ? "default" : "outline"}
                    onClick={() => setActiveSection("gains")}
                    className="flex-1"
                  >
                    Gains
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Enhancement text (optional)
                </label>
                <Textarea
                  placeholder="Add any specific instructions for the AI, e.g., 'Focus on B2B customers' or 'Consider sustainability aspects'"
                  value={enhancementText}
                  onChange={(e) => setEnhancementText(e.target.value)}
                  className="h-24"
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquareText className="h-4 w-4" />
                      <span>Generate with AI</span>
                    </>
                  )}
                </Button>
              </div>
              
              {isGenerating && (
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Generating USP Canvas elements...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {aiResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Jobs Panel */}
                <AICanvasResultPanel
                  title="Customer Jobs"
                  colorClass="bg-blue-50"
                  titleColorClass="text-blue-800"
                  items={aiResult.jobs?.map(job => ({
                    content: job.content,
                    level: job.priority,
                    levelLabel: "Priority"
                  })) || []}
                  onAdd={() => handleAddJobs(aiResult.jobs || [])}
                />
                
                {/* Pains Panel */}
                <AICanvasResultPanel
                  title="Customer Pains"
                  colorClass="bg-red-50"
                  titleColorClass="text-red-800"
                  items={aiResult.pains?.map(pain => ({
                    content: pain.content,
                    level: pain.severity,
                    levelLabel: "Severity"
                  })) || []}
                  onAdd={() => handleAddPains(aiResult.pains || [])}
                />
                
                {/* Gains Panel */}
                <AICanvasResultPanel
                  title="Customer Gains"
                  colorClass="bg-green-50"
                  titleColorClass="text-green-800"
                  items={aiResult.gains?.map(gain => ({
                    content: gain.content,
                    level: gain.importance,
                    levelLabel: "Importance"
                  })) || []}
                  onAdd={() => handleAddGains(aiResult.gains || [])}
                />
              </div>
              
              {(aiResult.jobs?.length || 0) + 
               (aiResult.pains?.length || 0) + 
               (aiResult.gains?.length || 0) > 0 && (
                <div className="flex justify-end">
                  <Button onClick={handleAddAll}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add All to Canvas
                  </Button>
                </div>
              )}
              
              {aiDebugInfo && <AIDebugPanel debugInfo={aiDebugInfo} />}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings">
          <AIPromptSettings 
            module="usp_canvas_profile" 
            title="USP Canvas AI Prompt Settings"
            description="Customize the AI prompts used to generate the Customer Jobs, Pains, and Gains for your USP Canvas."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Result panel component for displaying AI-generated canvas elements
interface AICanvasResultPanelProps {
  title: string;
  colorClass: string;
  titleColorClass: string;
  items: {
    content: string;
    level: 'low' | 'medium' | 'high';
    levelLabel: string;
  }[];
  onAdd: () => void;
}

const AICanvasResultPanel: React.FC<AICanvasResultPanelProps> = ({
  title,
  colorClass,
  titleColorClass,
  items,
  onAdd
}) => {
  return (
    <div className={`p-4 rounded-md ${colorClass}`}>
      <h3 className={`text-base font-medium mb-3 ${titleColorClass}`}>{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items generated</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm">{item.content}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">
                  {item.levelLabel}: 
                  <span className={`ml-1 font-medium ${
                    item.level === 'high' ? 'text-red-600' : 
                    item.level === 'medium' ? 'text-amber-600' : 
                    'text-green-600'
                  }`}>
                    {item.level}
                  </span>
                </span>
              </div>
            </div>
          ))}
          
          <div className="mt-3">
            <Button variant="secondary" size="sm" onClick={onAdd} className="w-full">
              <PlusCircle className="h-3 w-3 mr-2" />
              Add to Canvas
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UspCanvasAIGenerator;
