
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

  const generateResult = async (): Promise<void> => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('Generating USP Canvas profile with:', { 
        strategyId, 
        briefingContent: briefingContent.substring(0, 100) + '...',
        personaContent: personaContent ? personaContent.substring(0, 100) + '...' : undefined
      });
      
      // Use the UspCanvasService to generate the profile
      const response: AIServiceResponse<UspCanvasAIResult> = await UspCanvasService.generateUspCanvasProfile(
        strategyId,
        briefingContent,
        'all', // Generate all sections
        undefined, // No enhancement text
        personaContent
      );
      
      if (response.error) {
        console.error('Error from UspCanvasService:', response.error);
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('No data returned from AI service');
      }
      
      console.log('AI generation successful:', response.data);
      
      // Normalize the response data
      const normalizedData: StoredAIResult = {
        jobs: Array.isArray(response.data.jobs) ? response.data.jobs : [],
        pains: Array.isArray(response.data.pains) ? response.data.pains : [],
        gains: Array.isArray(response.data.gains) ? response.data.gains : []
      };
      
      // Store debug information
      const debugData = {
        raw: response.debugInfo,
        parsed: normalizedData,
        timestamp: new Date().toISOString()
      };
      
      setDebugInfo(debugData);
      
      // Store result and notify parent component
      if (onResultsGenerated) {
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
    generateResult
  };
};
