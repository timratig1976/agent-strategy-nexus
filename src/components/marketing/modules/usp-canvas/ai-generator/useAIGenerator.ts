
import { useState, useEffect } from 'react';
import { StoredAIResult } from '../types';
import { UspCanvasService, AIServiceResponse, UspCanvasAIResult } from '@/services/ai';

interface FormatOptions {
  strictFormat?: boolean;
  outputLanguage?: 'deutsch' | 'english';
}

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
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [parseResults, setParseResults] = useState<any>(null);

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

  // Helper function to handle JSON parsing
  const tryParseJson = (text: string): any | null => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  };

  // Helper function to extract items using regex
  const extractItemsWithRegex = (text: string): UspCanvasAIResult => {
    const result: UspCanvasAIResult = {
      jobs: [],
      pains: [],
      gains: []
    };
    
    // Improved regex patterns that handle multiple formats, including items with subheaders
    
    // Jobs regex - now more flexible to match different patterns of bullet points
    // and correctly extract priority levels regardless of format 
    const jobItems = text.match(/(?:[-•*]\s*|[0-9]+\.\s*)(?:\*\*)?([^():\n]+)(?:\*\*)?\s*(?:\((?:Priority|priority)?:?\s*(high|medium|low)\)|(?:high|medium|low)\s+priority)?\s*:?\s*([^-•*\n][^\n]*)?\n?/gi);
    
    if (jobItems) {
      jobItems.forEach(item => {
        // Skip headers or empty lines
        if (item.trim().length < 5 || /^#|^§|functional|social|emotional|jobs/i.test(item)) return;
        
        let content = item.replace(/^[-•*]|\d+\.\s*|\*\*/g, '').trim();
        let priority = 'medium'; // Default priority
        
        // Extract priority
        if (/high priority|\(priority:?\s*high\)|priority:?\s*high|high\)/i.test(item)) {
          priority = 'high';
          content = content.replace(/\(?priority:?\s*high\)?|high priority|high\)/i, '').trim();
        } else if (/low priority|\(priority:?\s*low\)|priority:?\s*low|low\)/i.test(item)) {
          priority = 'low';
          content = content.replace(/\(?priority:?\s*low\)?|low priority|low\)/i, '').trim();
        } else if (/medium priority|\(priority:?\s*medium\)|priority:?\s*medium|medium\)/i.test(item)) {
          priority = 'medium';
          content = content.replace(/\(?priority:?\s*medium\)?|medium priority|medium\)/i, '').trim();
        }
        
        // Clean up any residual formatting
        content = content
          .replace(/\(?priority:?\s*(high|medium|low)\)?/i, '')
          .replace(/:$/, '')
          .replace(/\*\*/g, '')
          .trim();
          
        if (content.length > 0) {
          result.jobs.push({ content, priority: priority as 'low' | 'medium' | 'high' });
        }
      });
    }
    
    // Similar improved regex for pains
    const painItems = text.match(/(?:[-•*]\s*|[0-9]+\.\s*)(?:\*\*)?([^():\n]+)(?:\*\*)?\s*(?:\((?:Severity|severity)?:?\s*(high|medium|low)\)|(?:high|medium|low)\s+severity)?\s*:?\s*([^-•*\n][^\n]*)?\n?/gi);
    
    if (painItems) {
      painItems.forEach(item => {
        // Skip headers or empty lines
        if (item.trim().length < 5 || /^#|^§|severity pains/i.test(item)) return;
        
        let content = item.replace(/^[-•*]|\d+\.\s*|\*\*/g, '').trim();
        let severity = 'medium'; // Default severity
        
        // Extract severity
        if (/high severity|\(severity:?\s*high\)|severity:?\s*high|high\)/i.test(item)) {
          severity = 'high';
          content = content.replace(/\(?severity:?\s*high\)?|high severity|high\)/i, '').trim();
        } else if (/low severity|\(severity:?\s*low\)|severity:?\s*low|low\)/i.test(item)) {
          severity = 'low';
          content = content.replace(/\(?severity:?\s*low\)?|low severity|low\)/i, '').trim();
        } else if (/medium severity|\(severity:?\s*medium\)|severity:?\s*medium|medium\)/i.test(item)) {
          severity = 'medium';
          content = content.replace(/\(?severity:?\s*medium\)?|medium severity|medium\)/i, '').trim();
        }
        
        // Clean up any residual formatting
        content = content
          .replace(/\(?severity:?\s*(high|medium|low)\)?/i, '')
          .replace(/:$/, '')
          .replace(/\*\*/g, '')
          .trim();
          
        if (content.length > 0) {
          result.pains.push({ content, severity: severity as 'low' | 'medium' | 'high' });
        }
      });
    }
    
    // Similar improved regex for gains
    const gainItems = text.match(/(?:[-•*]\s*|[0-9]+\.\s*)(?:\*\*)?([^():\n]+)(?:\*\*)?\s*(?:\((?:Importance|importance)?:?\s*(high|medium|low)\)|(?:high|medium|low)\s+importance)?\s*:?\s*([^-•*\n][^\n]*)?\n?/gi);
    
    if (gainItems) {
      gainItems.forEach(item => {
        // Skip headers or empty lines
        if (item.trim().length < 5 || /^#|^§|importance gains/i.test(item)) return;
        
        let content = item.replace(/^[-•*]|\d+\.\s*|\*\*/g, '').trim();
        let importance = 'medium'; // Default importance
        
        // Extract importance
        if (/high importance|\(importance:?\s*high\)|importance:?\s*high|high\)/i.test(item)) {
          importance = 'high';
          content = content.replace(/\(?importance:?\s*high\)?|high importance|high\)/i, '').trim();
        } else if (/low importance|\(importance:?\s*low\)|importance:?\s*low|low\)/i.test(item)) {
          importance = 'low';
          content = content.replace(/\(?importance:?\s*low\)?|low importance|low\)/i, '').trim();
        } else if (/medium importance|\(importance:?\s*medium\)|importance:?\s*medium|medium\)/i.test(item)) {
          importance = 'medium';
          content = content.replace(/\(?importance:?\s*medium\)?|medium importance|medium\)/i, '').trim();
        }
        
        // Clean up any residual formatting
        content = content
          .replace(/\(?importance:?\s*(high|medium|low)\)?/i, '')
          .replace(/:$/, '')
          .replace(/\*\*/g, '')
          .trim();
          
        if (content.length > 0) {
          result.gains.push({ content, importance: importance as 'low' | 'medium' | 'high' });
        }
      });
    }
    
    return result;
  };

  const generateResult = async (enhancementText?: string, formatOptions: FormatOptions = {}): Promise<void> => {
    setIsGenerating(true);
    setError(null);
    setRawResponse(null);
    setParseResults(null);
    console.log('Starting USP Canvas AI generation with format options:', formatOptions);

    try {
      console.log('Generating USP Canvas profile with:', { 
        strategyId, 
        briefingContentLength: briefingContent?.length || 0,
        personaContentLength: personaContent?.length || 0,
        enhancementTextProvided: !!enhancementText,
        formatOptions
      });
      
      // Use the UspCanvasService to generate the profile
      const response: AIServiceResponse<UspCanvasAIResult> = await UspCanvasService.generateUspCanvasProfile(
        strategyId,
        briefingContent,
        'all', // Generate all sections
        enhancementText, // Pass the enhancement text to the AI service
        personaContent,
        formatOptions // Pass the format options to the AI service
      );
      
      console.log('AI service response received:', response);
      setRawResponse(response);
      
      if (response.error) {
        console.error('Error from UspCanvasService:', response.error);
        throw new Error(response.error);
      }

      if (!response.data) {
        console.error('No data returned from AI service');
        throw new Error('No data returned from AI service');
      }
      
      console.log('AI generation successful, raw data:', response.data);
      
      // For strict JSON format, we try to use the parsed JSON directly
      // This assumes the backend correctly parsed the JSON from the AI response
      
      let extractedResults: UspCanvasAIResult;
      let rawAiContent = '';
      
      if (response.data?.rawOutput) {
        rawAiContent = response.data.rawOutput;
        
        // Try to handle JSON in the raw output
        const jsonData = tryParseJson(rawAiContent);
        if (jsonData && formatOptions.strictFormat && (jsonData.jobs || jsonData.pains || jsonData.gains)) {
          console.log('Found JSON data in raw output:', jsonData);
          extractedResults = jsonData;
        } else {
          // Fall back to regex parsing
          console.log('Using regex parsing on raw output');
          extractedResults = extractItemsWithRegex(rawAiContent);
        }
      } else {
        // Use the data provided by the backend
        extractedResults = {
          jobs: Array.isArray(response.data.jobs) ? response.data.jobs : [],
          pains: Array.isArray(response.data.pains) ? response.data.pains : [],
          gains: Array.isArray(response.data.gains) ? response.data.gains : []
        };
      }
      
      // Store parse results for debugging
      const parsingResults = {
        jobsFound: Array.isArray(extractedResults.jobs) ? extractedResults.jobs.length : 0,
        painsFound: Array.isArray(extractedResults.pains) ? extractedResults.pains.length : 0,
        gainsFound: Array.isArray(extractedResults.gains) ? extractedResults.gains.length : 0,
        rawText: rawAiContent,
        extractedItems: extractedResults
      };
      setParseResults(parsingResults);
      
      // Normalize the response data with additional validation
      const normalizedData: StoredAIResult = {
        jobs: Array.isArray(extractedResults.jobs) 
          ? extractedResults.jobs
              .filter(job => job && job.content && typeof job.content === 'string')
              .map(job => ({ 
                content: job.content.trim(), 
                priority: ['high', 'medium', 'low'].includes(job.priority) ? job.priority : 'medium'
              }))
          : [],
          
        pains: Array.isArray(extractedResults.pains) 
          ? extractedResults.pains
              .filter(pain => pain && pain.content && typeof pain.content === 'string')
              .map(pain => ({ 
                content: pain.content.trim(), 
                severity: ['high', 'medium', 'low'].includes(pain.severity) ? pain.severity : 'medium'
              }))
          : [],
          
        gains: Array.isArray(extractedResults.gains) 
          ? extractedResults.gains
              .filter(gain => gain && gain.content && typeof gain.content === 'string')
              .map(gain => ({ 
                content: gain.content.trim(), 
                importance: ['high', 'medium', 'low'].includes(gain.importance) ? gain.importance : 'medium'
              }))
          : []
      };
      
      console.log('Normalized data:', normalizedData);
      
      // Validate data completeness
      const validationResults = {
        jobsComplete: normalizedData.jobs.length > 0,
        painsComplete: normalizedData.pains.length > 0,
        gainsComplete: normalizedData.gains.length > 0,
        isComplete: normalizedData.jobs.length > 0 && normalizedData.pains.length > 0 && normalizedData.gains.length > 0
      };
      
      // Store debug information
      const debugData = {
        timestamp: new Date().toISOString(),
        requestData: {
          strategyId,
          briefingContentLength: briefingContent?.length || 0,
          personaContentLength: personaContent?.length || 0,
          enhancementText,
          formatOptions
        },
        responseRaw: response.data,
        responseDebug: response.debugInfo,
        parsingResults,
        validationResults,
        normalizedData,
        rawAiContent
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
    generationHistory,
    rawResponse,
    parseResults
  };
};
