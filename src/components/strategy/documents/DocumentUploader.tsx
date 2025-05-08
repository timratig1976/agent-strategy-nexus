import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FileUpIcon, Loader2, XIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { DocumentUploadState } from '@/types/document';

interface DocumentUploaderProps {
  strategyId: string;
  onUploadComplete: (filePath: string, fileName: string, fileType: string, fileSize: number) => Promise<void>;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ strategyId, onUploadComplete }) => {
  const [uploadState, setUploadState] = useState<DocumentUploadState>({
    uploading: false,
    progress: {},
    error: null
  });
  const { toast } = useToast();
  
  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      
      setUploadState(prev => ({
        ...prev,
        uploading: true,
        error: null
      }));
      
      try {
        // Process each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name;
          
          // Initialize progress for this file
          setUploadState(prev => ({
            ...prev,
            progress: { ...prev.progress, [fileName]: 0 }
          }));
          
          // Upload the file to Supabase Storage
          const filePath = `${strategyId}/${Date.now()}-${fileName}`;
          const { error: uploadError, data } = await supabase.storage
            .from('strategy_documents')
            .upload(filePath, file, {
              onUploadProgress: (progress) => {
                const progressPercentage = Math.round((progress.loaded / progress.total) * 100);
                setUploadState(prev => ({
                  ...prev,
                  progress: { ...prev.progress, [fileName]: progressPercentage }
                }));
              },
            });
          
          if (uploadError) {
            throw new Error(`Error uploading ${fileName}: ${uploadError.message}`);
          }
          
          // Update the database with the file metadata
          await onUploadComplete(filePath, fileName, file.type, file.size);
          
          toast({
            title: 'File uploaded successfully',
            description: `${fileName} has been uploaded and is being processed.`
          });
        }
      } catch (error) {
        console.error('Error in document upload:', error);
        setUploadState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        }));
        
        toast({
          variant: 'destructive',
          title: 'Upload failed',
          description: error instanceof Error ? error.message : 'Failed to upload document'
        });
      } finally {
        setUploadState(prev => ({
          ...prev,
          uploading: false,
          // Keep progress for a moment so user can see completion
          // It will be cleared on the next upload
        }));
        
        // Reset the file input
        event.target.value = '';
      }
    },
    [strategyId, onUploadComplete, toast]
  );
  
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <input
            type="file"
            id="document-upload"
            className="sr-only"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.xls"
            multiple
            disabled={uploadState.uploading}
          />
          <label
            htmlFor="document-upload"
            className={`w-full cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
              ${uploadState.uploading 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
              } h-10 px-4 py-2`}
          >
            {uploadState.uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileUpIcon className="mr-2 h-4 w-4" />
            )}
            {uploadState.uploading ? 'Uploading...' : 'Upload Documents'}
          </label>
        </div>
        
        {uploadState.error && (
          <div className="text-sm text-destructive">{uploadState.error}</div>
        )}
        
        {/* Show progress bars for any files being uploaded */}
        {Object.entries(uploadState.progress).map(([fileName, progress]) => (
          <div key={fileName} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="truncate max-w-xs">{fileName}</div>
              <div>{progress}%</div>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        ))}
        
        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, Word, Excel, Text, CSV
        </p>
      </div>
    </div>
  );
};

export default DocumentUploader;
