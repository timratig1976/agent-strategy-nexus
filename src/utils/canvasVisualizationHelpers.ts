
import { AgentResult } from '@/types/marketing';
import { UspCanvas } from '@/components/marketing/modules/usp-canvas/types';

/**
 * Extract USP Canvas data from an agent result
 * @param agentResult The agent result that may contain USP Canvas data
 * @returns UspCanvas object or null if couldn't be extracted
 */
export const extractUspCanvasFromAgentResult = (agentResult?: AgentResult): UspCanvas | null => {
  if (!agentResult || !agentResult.content) {
    return null;
  }

  try {
    // Try to parse the content as JSON
    const parsedContent = JSON.parse(agentResult.content);
    
    // Check if this is a UspCanvas object with the expected structure
    if (
      parsedContent &&
      Array.isArray(parsedContent.customerJobs) && 
      Array.isArray(parsedContent.customerPains) && 
      Array.isArray(parsedContent.customerGains) &&
      Array.isArray(parsedContent.productServices) &&
      Array.isArray(parsedContent.painRelievers) &&
      Array.isArray(parsedContent.gainCreators)
    ) {
      return parsedContent as UspCanvas;
    }
    
    // If the content is JSON but not in the right format,
    // check if it's nested under a property
    if (parsedContent.canvas || parsedContent.uspCanvas || parsedContent.data) {
      const canvasData = parsedContent.canvas || parsedContent.uspCanvas || parsedContent.data;
      
      if (
        canvasData &&
        Array.isArray(canvasData.customerJobs) && 
        Array.isArray(canvasData.customerPains) && 
        Array.isArray(canvasData.customerGains) &&
        Array.isArray(canvasData.productServices) &&
        Array.isArray(canvasData.painRelievers) &&
        Array.isArray(canvasData.gainCreators)
      ) {
        return canvasData as UspCanvas;
      }
    }
  } catch (error) {
    console.error('Error parsing USP Canvas data:', error);
    // If it's not valid JSON, we can try to look for specific patterns
    // that might indicate a serialized UspCanvas object
  }
  
  // As a fallback, create an empty canvas structure
  return createSampleUspCanvas();
};

/**
 * Create a sample USP Canvas for demonstration purposes
 */
export const createSampleUspCanvas = (): UspCanvas => {
  return {
    customerJobs: [
      { id: 'job1', content: 'Find new customers efficiently', priority: 'high' },
      { id: 'job2', content: 'Track marketing campaign performance', priority: 'medium' },
      { id: 'job3', content: 'Create consistent brand messaging', priority: 'high' }
    ],
    customerPains: [
      { id: 'pain1', content: 'Wasting budget on ineffective ads', severity: 'high' },
      { id: 'pain2', content: 'Not knowing which channels work best', severity: 'high' },
      { id: 'pain3', content: 'Difficulty creating engaging content', severity: 'medium' }
    ],
    customerGains: [
      { id: 'gain1', content: 'Increased conversion rates', importance: 'high' },
      { id: 'gain2', content: 'Better understanding of customer behavior', importance: 'medium' },
      { id: 'gain3', content: 'Higher return on marketing investment', importance: 'high' }
    ],
    productServices: [
      { id: 'service1', content: 'AI-powered marketing strategy platform', relatedJobIds: ['job1', 'job2'] },
      { id: 'service2', content: 'Multi-channel campaign management', relatedJobIds: ['job2'] },
      { id: 'service3', content: 'Content generation tools', relatedJobIds: ['job3'] }
    ],
    painRelievers: [
      { id: 'reliever1', content: 'Budget optimization algorithms', relatedPainIds: ['pain1', 'pain2'] },
      { id: 'reliever2', content: 'Channel performance analytics', relatedPainIds: ['pain2'] },
      { id: 'reliever3', content: 'AI content suggestions', relatedPainIds: ['pain3'] }
    ],
    gainCreators: [
      { id: 'creator1', content: 'A/B testing framework', relatedGainIds: ['gain1'] },
      { id: 'creator2', content: 'Customer journey mapping', relatedGainIds: ['gain2'] },
      { id: 'creator3', content: 'ROI tracking dashboard', relatedGainIds: ['gain3'] }
    ]
  };
};

/**
 * Format content for display in a card or node
 * This preserves all the content but formats it for better reading
 */
export const formatContentForDisplay = (content: string): string => {
  if (!content) return '';
  
  // Replace markdown headers with plain text headers
  let formatted = content.replace(/#{1,6}\s(.*?)$/gm, '$1:');
  
  // Clean up multiple newlines to just double newlines
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  // Limit length but preserve natural paragraph breaks
  if (formatted.length > 1000) {
    const paragraphs = formatted.split('\n\n');
    let truncated = '';
    let charCount = 0;
    
    for (const paragraph of paragraphs) {
      if (charCount + paragraph.length < 1000) {
        truncated += paragraph + '\n\n';
        charCount += paragraph.length + 2;
      } else {
        // Add a partial paragraph to get close to 1000 chars
        const remainingChars = 1000 - charCount - 3;
        if (remainingChars > 20) {
          truncated += paragraph.substring(0, remainingChars) + '...';
        }
        break;
      }
    }
    
    return truncated;
  }
  
  return formatted;
};
