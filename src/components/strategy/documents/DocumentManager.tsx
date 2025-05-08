
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StrategyDocument } from '@/types/document';
import DocumentUploader from './DocumentUploader';
import DocumentList from './DocumentList';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { FilesIcon } from 'lucide-react';

interface DocumentManagerProps {
  strategyId: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ strategyId }) => {
  const [documents, setDocuments] = useState<StrategyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch documents for the strategy
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Fix: Using raw query instead of strategy_documents table reference
      const { data, error } = await supabase.rpc(
        'get_strategy_documents',
        { strategy_id_param: strategyId }
      );
      
      if (error) throw error;
      
      // Transform the data to match StrategyDocument type
      const typedDocs: StrategyDocument[] = data ? data.map((doc: any) => ({
        id: doc.id,
        strategy_id: doc.strategy_id,
        file_path: doc.file_path,
        file_name: doc.file_name,
        file_type: doc.file_type,
        file_size: doc.file_size,
        processed: doc.processed,
        extracted_text: doc.extracted_text,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      })) : [];
      
      setDocuments(typedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load documents',
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize by fetching documents
  useEffect(() => {
    fetchDocuments();
    
    // Subscribe to changes in the strategy_documents table
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

  // Handle document upload completion
  const handleUploadComplete = async (
    filePath: string,
    fileName: string,
    fileType: string,
    fileSize: number
  ) => {
    try {
      // Fix: Using raw query instead of strategy_documents table reference
      const { error } = await supabase.rpc(
        'insert_strategy_document',
        {
          strategy_id_param: strategyId,
          file_path_param: filePath,
          file_name_param: fileName,
          file_type_param: fileType,
          file_size_param: fileSize
        }
      );
      
      if (error) throw error;
      
      // Refresh the documents list
      await fetchDocuments();
    } catch (error) {
      console.error('Error saving document metadata:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save document',
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId: string, filePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('strategy_documents')
        .remove([filePath]);
      
      if (storageError) throw storageError;
      
      // Delete from database using RPC
      const { error: dbError } = await supabase.rpc(
        'delete_strategy_document',
        { document_id_param: documentId }
      );
      
      if (dbError) throw dbError;
      
      // Update local state
      setDocuments(documents.filter(doc => doc.id !== documentId));
      
      toast({
        title: 'Document deleted',
        description: 'The document has been removed'
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete document',
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="documents">
        <AccordionTrigger className="flex justify-between">
          <div className="flex items-center">
            <FilesIcon className="mr-2 h-5 w-5" />
            Strategy Documents
            <Badge variant="outline" className="ml-2">
              {documents.length}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <DocumentUploader
            strategyId={strategyId}
            onUploadComplete={handleUploadComplete}
          />
          
          <DocumentList 
            documents={documents}
            onDelete={handleDeleteDocument}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DocumentManager;
