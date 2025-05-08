
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StrategyDocument } from "@/types/document";
import { useToast } from "@/components/ui/use-toast";

export const useDocumentProcessing = (strategyId: string) => {
  const [documents, setDocuments] = useState<StrategyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingDocument, setProcessingDocument] = useState(false);
  const { toast } = useToast();

  // Fetch all documents for the strategy
  const fetchDocuments = async () => {
    if (!strategyId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('strategy_documents')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process an unprocessed document
  const processDocument = async (documentId: string) => {
    try {
      setProcessingDocument(true);
      
      // Call the edge function to process the document
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: { documentId }
      });
      
      if (error) throw error;
      
      console.log('Document processed:', data);
      
      // Refresh the documents list
      await fetchDocuments();
      
      return true;
    } catch (error) {
      console.error('Error processing document:', error);
      toast({
        variant: 'destructive',
        title: 'Document processing failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      return false;
    } finally {
      setProcessingDocument(false);
    }
  };

  // Get document content for AI prompts
  const getDocumentContentForAI = async (): Promise<string> => {
    try {
      // Get all processed documents
      const processedDocs = documents.filter(doc => doc.processed && doc.extracted_text);
      
      if (processedDocs.length === 0) {
        return '';
      }
      
      // Combine all document content with headers for each document
      let combinedContent = '--- ADDITIONAL DOCUMENTS ---\n\n';
      
      processedDocs.forEach(doc => {
        if (doc.extracted_text) {
          combinedContent += `--- DOCUMENT: ${doc.file_name} ---\n`;
          combinedContent += `${doc.extracted_text}\n\n`;
        }
      });
      
      return combinedContent;
    } catch (error) {
      console.error('Error getting document content for AI:', error);
      return '';
    }
  };

  // Process any unprocessed documents when the component mounts
  useEffect(() => {
    if (!strategyId) return;
    
    fetchDocuments();
    
    // Set up a subscription to track changes
    const subscription = supabase
      .channel('strategy_documents_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'strategy_documents',
          filter: `strategy_id=eq.${strategyId}`
        }, 
        () => {
          fetchDocuments();
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [strategyId]);

  // Process any unprocessed documents when documents change
  useEffect(() => {
    const processUnprocessedDocuments = async () => {
      const unprocessedDocs = documents.filter(doc => !doc.processed);
      
      if (unprocessedDocs.length > 0 && !processingDocument) {
        // Process one document at a time
        await processDocument(unprocessedDocs[0].id);
      }
    };
    
    processUnprocessedDocuments();
  }, [documents, processingDocument]);

  return {
    documents,
    loading,
    processingDocument,
    processDocument,
    fetchDocuments,
    getDocumentContentForAI
  };
};
