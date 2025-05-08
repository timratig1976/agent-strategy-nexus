
import React from 'react';
import { StrategyDocument } from '@/types/document';
import { FileIcon, Trash2Icon, FileTextIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentListProps {
  documents: StrategyDocument[];
  onDelete: (documentId: string, filePath: string) => Promise<void>;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDelete }) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No documents uploaded yet
      </div>
    );
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileIcon className="h-4 w-4 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FileIcon className="h-4 w-4 text-blue-500" />;
    if (fileType.includes('excel') || fileType.includes('sheet') || fileType.includes('csv')) 
      return <FileIcon className="h-4 w-4 text-green-500" />;
    return <FileTextIcon className="h-4 w-4 text-gray-500" />;
  };

  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <Card key={doc.id} className="overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="flex-shrink-0">
                  {getFileIcon(doc.file_type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(doc.file_size)} • Uploaded {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          {doc.processed ? 
                            <CheckCircleIcon className="h-4 w-4 text-green-500" /> : 
                            <AlertCircleIcon className="h-4 w-4 text-amber-500" />
                          }
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        {doc.processed ? 'Processed' : 'Processing...'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(doc.id, doc.file_path)}
                className="h-8 w-8"
              >
                <Trash2Icon className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentList;
