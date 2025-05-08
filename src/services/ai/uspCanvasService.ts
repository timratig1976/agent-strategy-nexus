
import { supabase } from "@/integrations/supabase/client";
import { AIServiceResponse, UspCanvasAIResult } from "./types";
import { MarketingAIService } from "./marketingAIService";

interface FormatOptions {
  strictFormat?: boolean;
  outputLanguage?: 'deutsch' | 'english';
}

export class UspCanvasService {
  /**
   * Generate USP Canvas Profile elements (Jobs, Pains, Gains)
   */
  static async generateUspCanvasProfile(
    strategyId: string,
    briefingContent: string,
    section?: 'jobs' | 'pains' | 'gains' | 'all',
    enhancementText?: string,
    personaContent?: string,
    formatOptions?: FormatOptions
  ): Promise<AIServiceResponse<UspCanvasAIResult>> {
    console.log('UspCanvasService.generateUspCanvasProfile called with:', {
      strategyId,
      section,
      briefingContentLength: briefingContent?.length || 0,
      personaContentLength: personaContent?.length || 0,
      enhancementText: enhancementText ? 'provided' : 'not provided',
      formatOptions
    });
    
    try {
      console.log('Invoking Supabase function: marketing-ai');
      const startTime = Date.now();
      
      const { data, error } = await supabase.functions.invoke('marketing-ai', {
        body: { 
          module: 'usp_canvas_profile', 
          action: 'generate', 
          data: {
            strategyId,
            briefingContent,
            section: section || 'all',
            enhancementText,
            personaContent,
            formatOptions
          }
        }
      });
      
      const endTime = Date.now();
      console.log(`Supabase function response received in ${endTime - startTime}ms`);
      
      if (error) {
        console.error('Supabase function error:', error);
        return {
          error: error.message || 'Failed to generate USP Canvas profile',
          debugInfo: {
            requestData: { 
              strategyId,
              briefingContentLength: briefingContent?.length || 0,
              personaContentLength: personaContent?.length || 0,
              section,
              enhancementText,
              formatOptions
            },
            responseData: { errorDetails: error }
          }
        };
      }
      
      if (!data || !data.result) {
        console.error('Invalid response format from marketing-ai function:', data);
        return {
          error: 'Invalid response from AI service',
          debugInfo: {
            requestData: { 
              strategyId,
              briefingContentLength: briefingContent?.length || 0,
              personaContentLength: personaContent?.length || 0,
              section,
              enhancementText,
              formatOptions
            },
            responseData: data
          }
        };
      }

      // If the AI response contains raw output but parsed data is incomplete, try to parse it again
      if (data.result.rawOutput && 
         (!data.result.jobs?.length || !data.result.pains?.length || !data.result.gains?.length)) {
        console.log('Attempting to manually parse incomplete AI response');
        const parsedResult = this.parseAIResponse(data.result.rawOutput);
        
        // Merge the parsed results with any existing ones
        data.result = {
          ...data.result,
          jobs: data.result.jobs?.length ? data.result.jobs : parsedResult.jobs,
          pains: data.result.pains?.length ? data.result.pains : parsedResult.pains,
          gains: data.result.gains?.length ? data.result.gains : parsedResult.gains
        };
      }
      
      console.log('USP Canvas profile generation result:', data.result);
      
      return {
        data: data.result as UspCanvasAIResult,
        debugInfo: {
          requestData: { 
            strategyId,
            briefingContentLength: briefingContent?.length || 0,
            personaContentLength: personaContent?.length || 0,
            section,
            enhancementText,
            formatOptions
          },
          responseData: {
            result: data,
            timeTaken: `${endTime - startTime}ms`,
            timestamp: new Date().toISOString()
          }
        }
      };
    } catch (error) {
      console.error('Error in UspCanvasService.generateUspCanvasProfile:', error);
      return { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred while generating USP Canvas profile',
        debugInfo: {
          requestData: { 
            strategyId,
            briefingContentLength: briefingContent?.length || 0,
            personaContentLength: personaContent?.length || 0,
            section,
            enhancementText,
            formatOptions
          },
          responseData: { errorMessage: String(error) }
        }
      };
    }
  }

  /**
   * Manually parse AI response for USP Canvas profile elements
   */
  private static parseAIResponse(rawText: string): {
    jobs: Array<{content: string, priority: 'low' | 'medium' | 'high'}>,
    pains: Array<{content: string, severity: 'low' | 'medium' | 'high'}>,
    gains: Array<{content: string, importance: 'low' | 'medium' | 'high'}>
  } {
    const result = {
      jobs: [] as Array<{content: string, priority: 'low' | 'medium' | 'high'}>,
      pains: [] as Array<{content: string, severity: 'low' | 'medium' | 'high'}>,
      gains: [] as Array<{content: string, importance: 'low' | 'medium' | 'high'}>
    };

    try {
      // Find the customer jobs section
      const jobsMatch = rawText.match(/### 1\.\s*Customer Jobs[\s\S]*?(?=---)/i);
      if (jobsMatch) {
        const jobsSection = jobsMatch[0];
        const jobMatches = jobsSection.matchAll(/\*\*(.*?)\s*\((High|Medium|Low)\s*Priority\)\:\*\*\s*(.*?)(?=\n\n|\n\*\*|$)/gi);
        
        for (const match of jobMatches) {
          const content = match[1] ? `${match[1]}: ${match[3].trim()}` : match[3].trim();
          const priority = match[2].toLowerCase() as 'low' | 'medium' | 'high';
          result.jobs.push({ content, priority });
        }
        
        // If we didn't find any jobs in this format, try a different pattern
        if (result.jobs.length === 0) {
          const simpleJobMatches = jobsSection.matchAll(/\-\s*\*\*(.*?)\s*\((High|Medium|Low)\s*Priority\)\:\*\*\s*(.*?)(?=\n|\n\-|\n\*\*|$)/gi);
          for (const match of simpleJobMatches) {
            const content = match[3] ? `${match[1]}: ${match[3].trim()}` : match[1].trim();
            const priority = match[2].toLowerCase() as 'low' | 'medium' | 'high';
            result.jobs.push({ content, priority });
          }
        }
      }

      // Find the customer pains section
      const painsMatch = rawText.match(/### 2\.\s*Customer Pains[\s\S]*?(?=---)/i);
      if (painsMatch) {
        const painsSection = painsMatch[0];
        const painMatches = painsSection.matchAll(/\*\*(.*?)\s*\((High|Medium|Low)\s*Severity\)\:\*\*\s*(.*?)(?=\n\n|\n\*\*|$)/gi);
        
        for (const match of painMatches) {
          const content = match[1] ? `${match[1]}: ${match[3].trim()}` : match[3].trim();
          const severity = match[2].toLowerCase() as 'low' | 'medium' | 'high';
          result.pains.push({ content, severity });
        }
        
        // If we didn't find any pains in this format, try a different pattern
        if (result.pains.length === 0) {
          const lines = painsSection.split('\n').filter(line => line.trim().length > 0);
          for (const line of lines) {
            if (line.startsWith('**') && line.includes('Severity'):') {
              const match = line.match(/\*\*(.*?)\s*\((High|Medium|Low)\s*Severity\)\:\*\*\s*(.*)/i);
              if (match) {
                const content = match[1].trim();
                const severity = match[2].toLowerCase() as 'low' | 'medium' | 'high';
                result.pains.push({ content, severity });
              }
            } else if (!line.startsWith('#') && !line.startsWith('-') && line.trim().length > 10) {
              // Catch paragraph-style pains without explicit severity marking
              // Default to medium severity if not specified
              result.pains.push({ content: line.trim(), severity: 'medium' });
            }
          }
        }
      }

      // Find the customer gains section
      const gainsMatch = rawText.match(/### 3\.\s*Customer Gains[\s\S]*?(?=---|\n\s*$/i);
      if (gainsMatch) {
        const gainsSection = gainsMatch[0];
        const gainMatches = gainsSection.matchAll(/\*\*(.*?)\s*\((High|Medium|Low)\s*Importance\)\:\*\*\s*(.*?)(?=\n\n|\n\*\*|$)/gi);
        
        for (const match of gainMatches) {
          const content = match[1] ? `${match[1]}: ${match[3].trim()}` : match[3].trim();
          const importance = match[2].toLowerCase() as 'low' | 'medium' | 'high';
          result.gains.push({ content, importance });
        }
        
        // If we didn't find any gains in this format, try a different pattern
        if (result.gains.length === 0) {
          const lines = gainsSection.split('\n').filter(line => line.trim().length > 0);
          for (const line of lines) {
            if (line.startsWith('**') && line.includes('Importance'):') {
              const match = line.match(/\*\*(.*?)\s*\((High|Medium|Low)\s*Importance\)\:\*\*\s*(.*)/i);
              if (match) {
                const content = match[1].trim();
                const importance = match[2].toLowerCase() as 'low' | 'medium' | 'high';
                result.gains.push({ content, importance });
              }
            } else if (!line.startsWith('#') && !line.startsWith('-') && line.trim().length > 10) {
              // Catch paragraph-style gains without explicit importance marking
              // Default to medium importance if not specified
              result.gains.push({ content: line.trim(), importance: 'medium' });
            }
          }
        }
      }

      // Last resort - try to parse items from the provided structured format
      if (result.jobs.length === 0) {
        const jobItems = this.parseStructuredItems(rawText, 'jobs', 'priority');
        if (jobItems.length > 0) result.jobs = jobItems;
      }

      if (result.pains.length === 0) {
        const painItems = this.parseStructuredItems(rawText, 'pains', 'severity');
        if (painItems.length > 0) result.pains = painItems;
      }
      
      if (result.gains.length === 0) {
        const gainItems = this.parseStructuredItems(rawText, 'gains', 'importance');
        if (gainItems.length > 0) result.gains = gainItems;
      }

      console.log('Manual parsing results:', {
        jobsFound: result.jobs.length,
        painsFound: result.pains.length,
        gainsFound: result.gains.length
      });

    } catch (error) {
      console.error('Error parsing AI response:', error);
    }

    return result;
  }

  /**
   * Helper method to parse structured items from the given format
   */
  private static parseStructuredItems(rawText: string, type: 'jobs' | 'pains' | 'gains', ratingType: 'priority' | 'severity' | 'importance'): Array<any> {
    const items = [];
    const sectionTitle = type === 'jobs' ? 'Customer Jobs' : 
                         type === 'pains' ? 'Customer Pains' : 
                         'Customer Gains';
    
    try {
      // Find the content between section headers
      const lines = rawText.split('\n');
      let inTargetSection = false;
      let currentItem = '';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Detect section start
        if (line.includes(sectionTitle) && line.startsWith('###')) {
          inTargetSection = true;
          continue;
        }
        
        // Detect section end
        if (inTargetSection && line.startsWith('###')) {
          inTargetSection = false;
          continue;
        }
        
        // Process lines within the section
        if (inTargetSection && line.startsWith('**') && line.length > 5) {
          // If we have a previous item, save it
          if (currentItem) {
            const ratingMatch = currentItem.match(new RegExp(`\\((High|Medium|Low)\\s*${ratingType})`, 'i'));
            const rating = ratingMatch ? ratingMatch[1].toLowerCase() : 'medium';
            
            const ratingProp = ratingType === 'priority' ? 'priority' : 
                              ratingType === 'severity' ? 'severity' : 'importance';
            
            items.push({ 
              content: currentItem.replace(new RegExp(`\\((High|Medium|Low)\\s*${ratingType}\\)`, 'i'), '').trim(),
              [ratingProp]: rating as 'low' | 'medium' | 'high' 
            });
          }
          
          // Start a new item
          currentItem = line;
        } 
        // Continue collecting the current item
        else if (inTargetSection && currentItem && !line.startsWith('#') && line.length > 0) {
          currentItem += ' ' + line;
        }
      }
      
      // Don't forget to add the last item if exists
      if (inTargetSection && currentItem) {
        const ratingMatch = currentItem.match(new RegExp(`\\((High|Medium|Low)\\s*${ratingType})`, 'i'));
        const rating = ratingMatch ? ratingMatch[1].toLowerCase() : 'medium';
        
        const ratingProp = ratingType === 'priority' ? 'priority' : 
                          ratingType === 'severity' ? 'severity' : 'importance';
        
        items.push({ 
          content: currentItem.replace(new RegExp(`\\((High|Medium|Low)\\s*${ratingType}\\)`, 'i'), '').trim(),
          [ratingProp]: rating as 'low' | 'medium' | 'high'
        });
      }
    } catch (error) {
      console.error(`Error parsing structured ${type}:`, error);
    }
    
    return items;
  }
  
  /**
   * Generate USP Canvas Value Map elements (Products, Pain Relievers, Gain Creators)
   */
  static async generateUspCanvasValueMap(
    strategyId: string,
    briefingContent: string,
    customerProfile: any,
    section?: 'products' | 'painRelievers' | 'gainCreators' | 'all',
    enhancementText?: string,
    personaContent?: string,
    formatOptions?: FormatOptions
  ): Promise<AIServiceResponse<UspCanvasAIResult>> {
    return MarketingAIService.generateContent<UspCanvasAIResult>(
      'usp_canvas_value_map',
      'generate',
      {
        strategyId,
        briefingContent,
        customerProfile,
        section,
        enhancementText,
        personaContent,
        formatOptions
      }
    );
  }
}
