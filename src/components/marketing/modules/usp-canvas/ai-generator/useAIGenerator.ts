
import { useState } from 'react';
import { StoredAIResult } from '../types';
import { UspCanvasService, AIServiceResponse, UspCanvasAIResult } from '@/services/ai';

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
  const [generationHistory, setGenerationHistory] = useState<{timestamp: number, result: StoredAIResult}[]>([]);

  const generateResult = async (): Promise<void> => {
    setIsGenerating(true);
    setError(null);
    console.log('Starting USP Canvas AI generation...');

    try {
      console.log('Generating USP Canvas profile with:', { 
        strategyId, 
        briefingContentLength: briefingContent?.length || 0,
        personaContentLength: personaContent?.length || 0
      });
      
      // Use the UspCanvasService to generate the profile
      const response: AIServiceResponse<UspCanvasAIResult> = await UspCanvasService.generateUspCanvasProfile(
        strategyId,
        briefingContent,
        'all', // Generate all sections
        undefined, // No enhancement text
        personaContent
      );
      
      console.log('AI service response received:', response);
      
      if (response.error) {
        console.error('Error from UspCanvasService:', response.error);
        throw new Error(response.error);
      }

      if (!response.data) {
        console.error('No data returned from AI service');
        throw new Error('No data returned from AI service');
      }
      
      console.log('AI generation successful:', response.data);
      
      // Normalize the response data
      const normalizedData: StoredAIResult = {
        jobs: Array.isArray(response.data.jobs) 
          ? response.data.jobs.filter(job => job.content && !job.content.startsWith('*') && !job.content.startsWith('#')) 
          : [],
        pains: Array.isArray(response.data.pains) 
          ? response.data.pains.filter(pain => pain.content && !pain.content.startsWith('*') && !pain.content.startsWith('#')) 
          : [],
        gains: Array.isArray(response.data.gains) 
          ? response.data.gains.filter(gain => gain.content && !gain.content.startsWith('*') && !gain.content.startsWith('#')) 
          : []
      };
      
      // Store debug information
      const debugData = {
        timestamp: new Date().toISOString(),
        requestData: {
          strategyId,
          briefingContentLength: briefingContent?.length || 0,
          personaContentLength: personaContent?.length || 0
        },
        responseData: response.data,
        rawResponse: response.debugInfo,
        normalizedData
      };
      
      console.log('Debug data:', debugData);
      setDebugInfo(debugData);
      
      // Add to history
      const historyItem = {
        timestamp: Date.now(),
        result: normalizedData
      };
      setGenerationHistory(prevHistory => [...prevHistory, historyItem]);
      
      // Store result and notify parent component
      if (onResultsGenerated) {
        console.log('Passing AI results to parent component:', normalizedData);
        onResultsGenerated(normalizedData, debugData);
      }
    } catch (err: any) {
      console.error("Error generating canvas data:", err);
      setError(err.message || "Failed to generate canvas data. Please try again.");
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
    generateResult,
    generationHistory
  };
};
