
import { useState, useEffect } from 'react';
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

  // Load previously stored AI results from localStorage
  useEffect(() => {
    if (strategyId) {
      try {
        const savedResultsKey = `usp_canvas_${strategyId}_ai_results`;
        const savedHistoryKey = `usp_canvas_${strategyId}_ai_history`;
        
        const savedResults = localStorage.getItem(savedResultsKey);
        const savedHistory = localStorage.getItem(savedHistoryKey);
        
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults);
          // Only set debug info if it exists and if we don't already have it
          if (parsedResults.debugInfo && !debugInfo) {
            setDebugInfo(parsedResults.debugInfo);
          }
          
          // Notify parent component of existing results
          if (onResultsGenerated && parsedResults.data) {
            console.log('Loading saved AI results:', parsedResults.data);
            onResultsGenerated(parsedResults.data, parsedResults.debugInfo);
          }
        }
        
        if (savedHistory) {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory)) {
            setGenerationHistory(parsedHistory);
          }
        }
      } catch (error) {
        console.error('Error loading saved AI data:', error);
      }
    }
  }, [strategyId, onResultsGenerated]);

  const generateResult = async (enhancementText?: string): Promise<void> => {
    setIsGenerating(true);
    setError(null);
    console.log('Starting USP Canvas AI generation...');

    try {
      console.log('Generating USP Canvas profile with:', { 
        strategyId, 
        briefingContentLength: briefingContent?.length || 0,
        personaContentLength: personaContent?.length || 0,
        enhancementTextProvided: !!enhancementText
      });
      
      // Use the UspCanvasService to generate the profile
      const response: AIServiceResponse<UspCanvasAIResult> = await UspCanvasService.generateUspCanvasProfile(
        strategyId,
        briefingContent,
        'all', // Generate all sections
        enhancementText, // Pass the enhancement text to the AI service
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
      
      console.log('AI generation successful, raw data:', response.data);
      
      // Normalize the response data with additional validation
      const normalizedData: StoredAIResult = {
        jobs: Array.isArray(response.data.jobs) 
          ? response.data.jobs
              .filter(job => job && job.content && typeof job.content === 'string')
              .map(job => ({ 
                content: job.content.trim(), 
                priority: ['high', 'medium', 'low'].includes(job.priority) ? job.priority : 'medium'
              }))
          : [],
          
        pains: Array.isArray(response.data.pains) 
          ? response.data.pains
              .filter(pain => pain && pain.content && typeof pain.content === 'string')
              .map(pain => ({ 
                content: pain.content.trim(), 
                severity: ['high', 'medium', 'low'].includes(pain.severity) ? pain.severity : 'medium'
              }))
          : [],
          
        gains: Array.isArray(response.data.gains) 
          ? response.data.gains
              .filter(gain => gain && gain.content && typeof gain.content === 'string')
              .map(gain => ({ 
                content: gain.content.trim(), 
                importance: ['high', 'medium', 'low'].includes(gain.importance) ? gain.importance : 'medium'
              }))
          : []
      };
      
      console.log('Normalized data:', normalizedData);
      
      // Store debug information
      const debugData = {
        timestamp: new Date().toISOString(),
        requestData: {
          strategyId,
          briefingContentLength: briefingContent?.length || 0,
          personaContentLength: personaContent?.length || 0,
          enhancementText
        },
        responseRaw: response.data,
        responseDebug: response.debugInfo,
        normalizedData
      };
      
      console.log('Debug data:', debugData);
      setDebugInfo(debugData);
      
      // Add to history
      const historyItem = {
        timestamp: Date.now(),
        result: normalizedData
      };
      
      const updatedHistory = [...generationHistory, historyItem];
      setGenerationHistory(updatedHistory);
      
      // Save results and history to localStorage for persistence
      if (strategyId) {
        try {
          localStorage.setItem(
            `usp_canvas_${strategyId}_ai_results`, 
            JSON.stringify({ data: normalizedData, debugInfo: debugData, timestamp: Date.now() })
          );
          
          localStorage.setItem(
            `usp_canvas_${strategyId}_ai_history`, 
            JSON.stringify(updatedHistory)
          );
          
          console.log('Saved AI results to localStorage');
        } catch (err) {
          console.error('Error saving AI results to localStorage:', err);
        }
      }
      
      // Notify parent component
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
