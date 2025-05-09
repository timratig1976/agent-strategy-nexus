
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

/**
 * Hook for retrieving website crawl data for AI processing
 */
export const useWebsiteCrawlData = (strategyId: string) => {
  // Function to get website crawl data for AI
  const getWebsiteCrawlDataForAI = useCallback(async (): Promise<string | null> => {
    try {
      if (!strategyId) return null;

      // Get the latest crawl result from the database
      // Use contains() for proper JSON field filtering
      const { data: crawlResults, error } = await supabase
        .from('website_crawls')
        .select('*')
        .eq('strategy_id', strategyId)
        .contains('extracted_content', { url_type: 'website' })
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error fetching crawl results:", error);
        console.log("Retrieved latest website result: not found");
        return null;
      }
      
      if (!crawlResults || crawlResults.length === 0) {
        console.log("No website crawl data found for strategy:", strategyId);
        return null;
      }
      
      const firstResult = crawlResults[0];
      
      // Extract the markdown content to use with the AI
      let websiteContent = '';
      
      // Add website URL as header
      websiteContent += `# Website: ${firstResult.url}\n\n`;
      
      // Safely extract the markdown content from the extracted_content field
      if (firstResult.extracted_content && typeof firstResult.extracted_content === 'object') {
        // Check if extracted_content has a data array property
        const extractedContent = firstResult.extracted_content as { data?: Array<any> };
        
        if (Array.isArray(extractedContent.data) && extractedContent.data.length > 0) {
          // Check if the first item has a markdown property
          const firstItem = extractedContent.data[0];
          if (firstItem && typeof firstItem === 'object' && 'markdown' in firstItem) {
            websiteContent += firstItem.markdown;
          }
        }
      }
      
      return websiteContent;
    } catch (err) {
      console.error("Error getting website crawl data for AI:", err);
      return null;
    }
  }, [strategyId]);

  return { getWebsiteCrawlDataForAI };
};
