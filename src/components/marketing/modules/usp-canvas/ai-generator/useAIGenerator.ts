
import { useState } from 'react';
import { StoredAIResult } from '../types';

export const useAIGenerator = (
  strategyId: string,
  briefingContent: string,
  personaContent?: string,
  onResultsGenerated?: (results: StoredAIResult, debugInfo?: any) => void
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("jobs");

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
        if (onResultsGenerated) {
          onResultsGenerated(normalizedData, debugData);
        }
        
        return normalizedData;
      } catch (parseError) {
        console.error("Error parsing result:", parseError);
        throw new Error("Failed to parse AI results");
      }
    } catch (err: any) {
      console.error("Error generating canvas data:", err);
      setError(err.message || "Failed to generate canvas data. Please try again.");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    error,
    debugInfo,
    activeTab,
    setActiveTab,
    generateResult
  };
};
