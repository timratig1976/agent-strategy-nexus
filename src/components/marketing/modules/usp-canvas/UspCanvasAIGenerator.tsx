import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  RotateCw, 
  CheckCircle2, 
  PlusCircle, 
  Settings,
  MessageSquareText,
  Filter,
  User,
  UsersRound,
  Info,
  Bug
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
import { StoredAIResult } from "./types";

interface UspCanvasAIGeneratorProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  onAddJobs?: (jobs: UspCanvasJob[]) => void;
  onAddPains?: (pains: UspCanvasPain[]) => void;
  onAddGains?: (gains: UspCanvasGain[]) => void;
  storedAIResult?: StoredAIResult;
  onResultsGenerated?: (results: UspCanvasAIResult | null, debugInfo: any) => void;
}

export const UspCanvasAIGenerator: React.FC<UspCanvasAIGeneratorProps> = ({
  strategyId,
  briefingContent,
  personaContent = "",
  onAddJobs,
  onAddPains,
  onAddGains,
  storedAIResult,
  onResultsGenerated
}) => {
  const [activeTab, setActiveTab] = useState<string>("generate");
  const [activeSection, setActiveSection] = useState<string>("all");
  const [enhancementText, setEnhancementText] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [aiResult, setAiResult] = useState<UspCanvasAIResult | null>(null);
  const [aiDebugInfo, setAiDebugInfo] = useState<any>(null);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [includePersonaData, setIncludePersonaData] = useState<boolean>(true);
  const [isDebugVisible, setIsDebugVisible] = useState<boolean>(false);

  // Load stored AI results when the component mounts or when stored results change
  useEffect(() => {
    if (storedAIResult) {
      if (storedAIResult.jobs || storedAIResult.pains || storedAIResult.gains) {
        setAiResult({
          jobs: storedAIResult.jobs || [],
          pains: storedAIResult.pains || [],
          gains: storedAIResult.gains || []
        });
      }
      
      if (storedAIResult.debugInfo) {
        setAiDebugInfo(storedAIResult.debugInfo);
      }
    }
  }, [storedAIResult]);

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
      
      // Build the prompt enhancement
      let finalEnhancement = enhancementText;
      
      // Include persona data if available and opted-in
      if (personaContent && includePersonaData) {
        finalEnhancement += `\n\nConsider the following persona when generating ${activeSection === 'all' ? 'content' : activeSection}:\n${personaContent}`;
      }
      
      const result = await MarketingAIService.generateUspCanvasProfile(
        strategyId,
        briefingContent,
        section,
        finalEnhancement,
        includePersonaData ? personaContent : undefined
      );

      // Store debug info
      setAiDebugInfo(result.debugInfo);

      if (result.error) {
        clearInterval(progressInterval);
        toast.error(`Failed to generate USP Canvas profile: ${result.error}`);
        setProgress(0);
        setIsGenerating(false);
        return;
      }

      if (result.data) {
        setAiResult(result.data);
        clearInterval(progressInterval);
        setProgress(100);
        toast.success("USP Canvas profile elements generated successfully");
        
        // Pass the results back to parent component to preserve between tab changes
        if (onResultsGenerated) {
          onResultsGenerated(result.data, result.debugInfo);
        }
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

  // Toggle debug panel visibility
  const toggleDebugPanel = () => {
    setIsDebugVisible(!isDebugVisible);
  };

  // Filter items by priority/severity/importance
  const getFilteredItems = <T extends {priority?: 'low' | 'medium' | 'high', severity?: 'low' | 'medium' | 'high', importance?: 'low' | 'medium' | 'high'}>(
    items: T[] | undefined,
    priorityKey: 'priority' | 'severity' | 'importance'
  ): T[] => {
    if (!items) return [];
    if (selectedPriorityFilter === 'all') return items;
    
    return items.filter(item => item[priorityKey] === selectedPriorityFilter);
  };

  // Get filtered jobs, pains, and gains
  const filteredJobs = getFilteredItems(aiResult?.jobs, 'priority');
  const filteredPains = getFilteredItems(aiResult?.pains, 'severity');
  const filteredGains = getFilteredItems(aiResult?.gains, 'importance');

  // Check if results are available to display filter UI
  const hasResults = aiResult && (
    (aiResult.jobs && aiResult.jobs.length > 0) ||
    (aiResult.pains && aiResult.pains.length > 0) ||
    (aiResult.gains && aiResult.gains.length > 0)
  );

const parseAIResponse = (content) => {
  try {
    // If it's already a parsed object, just return it
    if (typeof content === 'object') return content;
    
    // Try parsing as JSON
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      // If not valid JSON, use regex parsing
      console.log("Not valid JSON, using regex parsing", e);
    }
    
    const result = {
      jobs: [],
      pains: [],
      gains: []
    };
    
    // Helper function to extract priority/severity/importance
    const extractLevel = (line, defaultLevel = 'medium') => {
      const levelMatches = line.match(/\((Priority|Severity|Importance):\s*(high|medium|low)\)/i);
      if (levelMatches) {
        return levelMatches[2].toLowerCase();
      }
      
      // Try alternative formats
      if (line.includes('high priority') || line.includes('high severity') || 
          line.includes('high importance') || line.includes('(High)')) {
        return 'high';
      } else if (line.includes('medium priority') || line.includes('medium severity') || 
                line.includes('medium importance') || line.includes('(Medium)')) {
        return 'medium';
      } else if (line.includes('low priority') || line.includes('low severity') || 
                line.includes('low importance') || line.includes('(Low)')) {
        return 'low';
      }
      
      return defaultLevel;
    };
    
    // Helper function to clean up content text
    const cleanContent = (line) => {
      // Remove numbering, bullet points, and level indicators
      let cleaned = line.replace(/^\d+\.\s*/, '') // Remove numbering like "1. "
                          .replace(/^[-*]\s*/, '') // Remove bullet points
                          .replace(/\(Priority:.*?\)/i, '') // Remove priority indicators
                          .replace(/\(Severity:.*?\)/i, '') // Remove severity indicators
                          .replace(/\(Importance:.*?\)/i, '') // Remove importance indicators
                          .replace(/\((High|Medium|Low)\)/i, '') // Remove abbreviated indicators
                          .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
                          .trim();
                          
      // Further cleanup for markdown formatting
      cleaned = cleaned.replace(/^\*\*|\*\*$/g, ''); // Remove leading/trailing asterisks
      cleaned = cleaned.replace(/^"|"$/g, ''); // Remove quotes
      
      return cleaned;
    };
    
    // Process content based on section patterns
    const sections = content.split(/####|###|##/);
    
    // Process each section
    sections.forEach(section => {
      if (!section.trim()) return;
      
      const lowerSection = section.toLowerCase();
      
      // Process jobs
      if (lowerSection.includes('customer jobs') || lowerSection.includes('jobs:')) {
        const lines = section.split('\n').filter(line => 
          line.trim() && 
          !line.toLowerCase().includes('customer jobs') && 
          !line.toLowerCase().includes('jobs:') &&
          !line.match(/^#+\s/)
        );
        
        lines.forEach(line => {
          if (line.trim()) {
            const priority = extractLevel(line);
            const content = cleanContent(line);
            
            // Skip headers and short content
            if (content.length > 3 && !content.startsWith('*') && !content.endsWith(':')) {
              result.jobs.push({ 
                content, 
                priority
              });
            }
          }
        });
      }
      
      // Process pains
      if (lowerSection.includes('customer pains') || lowerSection.includes('pains:')) {
        const lines = section.split('\n').filter(line => 
          line.trim() && 
          !line.toLowerCase().includes('customer pains') && 
          !line.toLowerCase().includes('pains:') &&
          !line.match(/^#+\s/)
        );
        
        lines.forEach(line => {
          if (line.trim()) {
            const severity = extractLevel(line);
            const content = cleanContent(line);
            
            // Skip headers and short content
            if (content.length > 3 && !content.startsWith('*') && !content.endsWith(':')) {
              result.pains.push({ 
                content, 
                severity
              });
            }
          }
        });
      }
      
      // Process gains
      if (lowerSection.includes('customer gains') || lowerSection.includes('gains:')) {
        const lines = section.split('\n').filter(line => 
          line.trim() && 
          !line.toLowerCase().includes('customer gains') && 
          !line.toLowerCase().includes('gains:') &&
          !line.match(/^#+\s/)
        );
        
        lines.forEach(line => {
          if (line.trim()) {
            const importance = extractLevel(line);
            const content = cleanContent(line);
            
            // Skip headers and short content
            if (content.length > 3 && !content.startsWith('*') && !content.endsWith(':')) {
              result.gains.push({ 
                content, 
                importance
              });
            }
          }
        });
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return { jobs: [], pains: [], gains: [] };
  }
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
              
              {personaContent && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-persona"
                    checked={includePersonaData}
                    onCheckedChange={setIncludePersonaData}
                  />
                  <div>
                    <Label htmlFor="include-persona" className="flex items-center gap-1">
                      <UsersRound className="h-4 w-4" /> Include persona data in generation
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Use the persona information to improve AI generation
                    </p>
                  </div>
                </div>
              )}
              
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
              
              <div className="flex justify-between">
                {aiDebugInfo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDebugPanel}
                    className="flex items-center gap-2"
                  >
                    <Bug className="h-4 w-4" />
                    {isDebugVisible ? 'Hide Debug Info' : 'Show Debug Info'}
                  </Button>
                )}

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
          
          {isDebugVisible && aiDebugInfo && (
            <AIDebugPanel debugInfo={aiDebugInfo} title="USP Canvas AI Debug Information" />
          )}
          
          {hasResults && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Filter by Priority</h3>
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm"
                      variant={selectedPriorityFilter === "all" ? "default" : "outline"}
                      onClick={() => setSelectedPriorityFilter("all")}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPriorityFilter === "high" ? "default" : "outline"}
                      onClick={() => setSelectedPriorityFilter("high")}
                    >
                      High
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPriorityFilter === "medium" ? "default" : "outline"}
                      onClick={() => setSelectedPriorityFilter("medium")}
                    >
                      Medium
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPriorityFilter === "low" ? "default" : "outline"}
                      onClick={() => setSelectedPriorityFilter("low")}
                    >
                      Low
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedPriorityFilter === 'all' 
                      ? 'Showing all priorities' 
                      : `Showing ${selectedPriorityFilter} priority items only`}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {aiResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Jobs Panel */}
                <AICanvasResultPanel
                  title="Customer Jobs"
                  colorClass="bg-blue-50"
                  titleColorClass="text-blue-800"
                  items={filteredJobs.map(job => ({
                    content: job.content,
                    level: job.priority,
                    levelLabel: "Priority"
                  }))}
                  totalCount={aiResult.jobs?.length || 0}
                  filteredCount={filteredJobs.length}
                  onAdd={() => handleAddJobs(filteredJobs)}
                />
                
                {/* Pains Panel */}
                <AICanvasResultPanel
                  title="Customer Pains"
                  colorClass="bg-red-50"
                  titleColorClass="text-red-800"
                  items={filteredPains.map(pain => ({
                    content: pain.content,
                    level: pain.severity,
                    levelLabel: "Severity"
                  }))}
                  totalCount={aiResult.pains?.length || 0}
                  filteredCount={filteredPains.length}
                  onAdd={() => handleAddPains(filteredPains)}
                />
                
                {/* Gains Panel */}
                <AICanvasResultPanel
                  title="Customer Gains"
                  colorClass="bg-green-50"
                  titleColorClass="text-green-800"
                  items={filteredGains.map(gain => ({
                    content: gain.content,
                    level: gain.importance,
                    levelLabel: "Importance"
                  }))}
                  totalCount={aiResult.gains?.length || 0}
                  filteredCount={filteredGains.length}
                  onAdd={() => handleAddGains(filteredGains)}
                />
              </div>
              
              {((aiResult.jobs?.length || 0) + 
               (aiResult.pains?.length || 0) + 
               (aiResult.gains?.length || 0)) > 0 && (
                <div className="flex justify-end">
                  <Button onClick={handleAddAll} className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add All to Canvas
                  </Button>
                </div>
              )}
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
  totalCount: number;
  filteredCount: number;
  onAdd: () => void;
}

const AICanvasResultPanel: React.FC<AICanvasResultPanelProps> = ({
  title,
  colorClass,
  titleColorClass,
  items,
  totalCount,
  filteredCount,
  onAdd
}) => {
  return (
    <div className={`p-4 rounded-md ${colorClass}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className={`text-base font-medium ${titleColorClass}`}>{title}</h3>
        {filteredCount !== totalCount && (
          <Badge variant="outline">
            Showing {filteredCount} of {totalCount}
          </Badge>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items{filteredCount !== totalCount ? " matching filter" : " generated"}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`bg-white p-3 rounded shadow-sm border-l-4 ${
                item.level === 'high' ? 'border-red-400' : 
                item.level === 'medium' ? 'border-amber-400' : 
                'border-green-400'
              }`}
            >
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
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={onAdd} 
              className="w-full"
              disabled={items.length === 0}
            >
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
