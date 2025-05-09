
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

export const useDocumentProcessing = (strategyId: string) => {
  // Function to get document content for AI
  const getDocumentContentForAI = useCallback(async (): Promise<string | null> => {
    try {
      if (!strategyId) return null;
      
      // Query the database for documents associated with this strategy
      const { data: documents, error } = await supabase.rpc('get_strategy_documents', {
        strategy_id_param: strategyId
      });
      
      if (error) {
        console.error("Error fetching documents:", error);
        return null;
      }
      
      if (!documents || documents.length === 0) {
        console.log("No documents found for strategy:", strategyId);
        return null;
      }
      
      // Prepare the document content for the AI
      // We'll combine all the extracted text from processed documents
      const processedDocs = documents.filter(doc => doc.processed && doc.extracted_text);
      
      if (processedDocs.length === 0) {
        console.log("No processed documents found with extracted text");
        return null;
      }
      
      // Combine the content from all documents with document name as header
      const combinedContent = processedDocs.map(doc => {
        return `# Document: ${doc.file_name}\n\n${doc.extracted_text}\n\n`;
      }).join('---\n\n');
      
      return combinedContent;
    } catch (err) {
      console.error("Error getting document content for AI:", err);
      return null;
    }
  }, [strategyId]);

  // Function to get website crawl data for AI
  const getWebsiteCrawlDataForAI = useCallback(async (): Promise<string | null> => {
    try {
      if (!strategyId) return null;

      // Get the latest crawl result from the database
      const { data: crawlResults, error } = await supabase
        .from('website_crawls')
        .select('url, extracted_content')
        .eq('project_id', strategyId) // Using project_id as that's the column name in website_crawls
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

  return {
    getDocumentContentForAI,
    getWebsiteCrawlDataForAI
  };
};
