
import React from "react";
import { BriefingProgressBar } from "../../components/BriefingProgressBar";
import { Textarea } from "@/components/ui/textarea";

interface BriefingContentEditorProps {
  content: string;
  editedContent: string;
  setEditedContent: (content: string) => void;
  isGenerating: boolean;
  progress: number;
  placeholder?: string;
}

const BriefingContentEditor: React.FC<BriefingContentEditorProps> = ({ 
  content, 
  editedContent, 
  setEditedContent, 
  isGenerating, 
  progress,
  placeholder = "Generated content will appear here..."
}) => {
  // Initialize edited content if it's empty but we have content
  React.useEffect(() => {
    if (content && !editedContent) {
      setEditedContent(content);
    }
  }, [content, editedContent, setEditedContent]);

  if (isGenerating) {
    return (
      <div className="relative min-h-[300px] bg-muted/20 rounded-md p-4">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
        <BriefingProgressBar progress={progress} />
      </div>
    );
  }

  return (
    <Textarea
      className="min-h-[300px] font-mono text-sm"
      value={editedContent}
      onChange={(e) => setEditedContent(e.target.value)}
      placeholder={placeholder}
    />
  );
};

export default BriefingContentEditor;
