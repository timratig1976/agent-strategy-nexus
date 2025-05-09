
import { supabase } from "@/integrations/supabase/client";
import { useCallback } from "react";

/**
 * Hook for retrieving document content for AI processing
 */
export const useDocumentContent = (strategyId: string) => {
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

  return { getDocumentContentForAI };
};
