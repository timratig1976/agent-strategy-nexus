
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
      // Using the correct table name 'website_crawls' instead of 'strategy_website_crawls'
      const { data: crawlResults, error } = await supabase
        .from('website_crawls')
        .select('url, extracted_content')
        .eq('project_id', strategyId) // Using project_id as that's the column name in website_crawls
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        console.error("Error fetching crawl results:", error);
        console.log("Retrieved latest website result: not found");
        return null;
      }
      
      if (!crawlResults) {
        console.log("No website crawl data found for strategy:", strategyId);
        return null;
      }

      // Extract the markdown content to use with the AI
      let websiteContent = '';
      
      // Add website URL as header
      websiteContent += `# Website: ${crawlResults.url}\n\n`;
      
      // Extract the markdown content from the extracted_content field
      if (crawlResults.extracted_content && 
          Array.isArray(crawlResults.extracted_content.data) && 
          crawlResults.extracted_content.data.length > 0) {
        if (crawlResults.extracted_content.data[0]?.markdown) {
          websiteContent += crawlResults.extracted_content.data[0].markdown;
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
