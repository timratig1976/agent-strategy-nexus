
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { StoredAIResult, CustomerJob, CustomerPain, CustomerGain } from './types';
import { ArrowDown, Loader2, AlertCircle, Check, Plus } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface UspCanvasAIGeneratorProps {
  strategyId: string;
  briefingContent: string;
  personaContent?: string;
  storedAIResult?: StoredAIResult;
  onAddJobs: (jobs: CustomerJob[]) => void;
  onAddPains: (pains: CustomerPain[]) => void;
  onAddGains: (gains: CustomerGain[]) => void;
  onResultsGenerated: (results: StoredAIResult, debugInfo?: any) => void;
}

const UspCanvasAIGenerator: React.FC<UspCanvasAIGeneratorProps> = ({
  strategyId,
  briefingContent,
  personaContent,
  storedAIResult = { jobs: [], pains: [], gains: [] },
  onAddJobs,
  onAddPains,
  onAddGains,
  onResultsGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const generateResult = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Call your Supabase Edge Function or other API 
      const response = await fetch('/api/marketing-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          module: 'usp_canvas_profile',
          action: 'generate',
          strategyId,
          briefingContent,
          personaContent,
          section: 'all'
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Store the parsed result for use across tabs
      let parsedData: StoredAIResult = { jobs: [], pains: [], gains: [] };
      
      try {
        // Try to parse the result if it's a string
        if (data.result && typeof data.result === 'string') {
          parsedData = JSON.parse(data.result);
        } else if (data.result) {
          // If it's already an object, use it directly
          parsedData = data.result;
        }
        
        // Create empty arrays for any missing sections
        const normalizedData: StoredAIResult = {
          jobs: Array.isArray(parsedData.jobs) ? parsedData.jobs : [],
          pains: Array.isArray(parsedData.pains) ? parsedData.pains : [],
          gains: Array.isArray(parsedData.gains) ? parsedData.gains : []
        };
        
        // Debug information
        const debugData = {
          raw: data.raw,
          parsed: normalizedData,
          timestamp: new Date().toISOString()
        };
        
        setDebugInfo(debugData);
        
        // Store result and notify parent component
        onResultsGenerated(normalizedData, debugData);
      } catch (parseError) {
        console.error("Error parsing result:", parseError);
        throw new Error("Failed to parse AI results");
      }
    } catch (err) {
      console.error("Error generating canvas data:", err);
      setError(err.message || "Failed to generate canvas data. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddJobs = () => {
    if (storedAIResult.jobs && storedAIResult.jobs.length > 0) {
      onAddJobs(storedAIResult.jobs);
    }
  };

  const handleAddPains = () => {
    if (storedAIResult.pains && storedAIResult.pains.length > 0) {
      onAddPains(storedAIResult.pains);
    }
  };

  const handleAddGains = () => {
    if (storedAIResult.gains && storedAIResult.gains.length > 0) {
      onAddGains(storedAIResult.gains);
    }
  };
  
  // Format content for display
  const formatContent = (items: any[] | undefined) => {
    if (!items || items.length === 0) return "No data available";
    
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="p-3 border rounded-md">
            <div className="flex gap-2 items-start">
              <div className={`px-2 py-1 text-xs rounded-full ${
                item.priority === 'high' || item.severity === 'high' || item.importance === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : item.priority === 'medium' || item.severity === 'medium' || item.importance === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {item.priority || item.severity || item.importance || 'medium'}
              </div>
              <div className="flex-1">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const hasResults = storedAIResult && (
    (storedAIResult.jobs && storedAIResult.jobs.length > 0) ||
    (storedAIResult.pains && storedAIResult.pains.length > 0) ||
    (storedAIResult.gains && storedAIResult.gains.length > 0)
  );

  return (
    <div className="space-y-8">
      <div className="bg-slate-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium mb-4">AI-Powered Value Proposition Canvas Generator</h3>
        <p className="mb-6">
          Generate customer jobs, pains, and gains automatically based on your marketing brief 
          and persona information. Then select which elements to add to your canvas.
        </p>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-center">
          <Button 
            onClick={generateResult} 
            disabled={isGenerating}
            className="flex items-center"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Canvas Data...
              </>
            ) : (
              <>
                Generate Canvas Data
              </>
            )}
          </Button>
        </div>
        
        {!isGenerating && hasResults && (
          <div className="mt-6 flex justify-center">
            <ArrowDown className="animate-bounce h-6 w-6 text-primary" />
          </div>
        )}
      </div>
      
      {!isGenerating && hasResults && (
        <div className="mt-8">
          <Tabs defaultValue="jobs">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="jobs" className="relative">
                Customer Jobs
                {storedAIResult.jobs && storedAIResult.jobs.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-blue-100 text-xs text-blue-800">
                    {storedAIResult.jobs.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="pains" className="relative">
                Customer Pains
                {storedAIResult.pains && storedAIResult.pains.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-100 text-xs text-red-800">
                    {storedAIResult.pains.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="gains" className="relative">
                Customer Gains
                {storedAIResult.gains && storedAIResult.gains.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-green-100 text-xs text-green-800">
                    {storedAIResult.gains.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Generated Customer Jobs</span>
                    <Button 
                      onClick={handleAddJobs} 
                      disabled={!storedAIResult.jobs || storedAIResult.jobs.length === 0}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add All to Canvas
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    The tasks your customers are trying to complete or problems they're trying to solve.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formatContent(storedAIResult.jobs)}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pains">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Generated Customer Pains</span>
                    <Button 
                      onClick={handleAddPains} 
                      disabled={!storedAIResult.pains || storedAIResult.pains.length === 0}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add All to Canvas
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    The negative experiences, risks, and obstacles customers face.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formatContent(storedAIResult.pains)}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="gains">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Generated Customer Gains</span>
                    <Button 
                      onClick={handleAddGains} 
                      disabled={!storedAIResult.gains || storedAIResult.gains.length === 0}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add All to Canvas
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    The benefits and positive outcomes your customers expect or would be surprised by.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formatContent(storedAIResult.gains)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default UspCanvasAIGenerator;
