
import React, { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AIContentEditorProps } from "./types";

/**
 * Component for editing AI-generated content
 */
const AIContentEditor: React.FC<AIContentEditorProps> = ({
  content,
  editedContent,
  setEditedContent,
  isGenerating,
  progress,
  placeholder = "AI-generated content will appear here...",
  readOnly = false,
  minHeight = "300px"
}) => {
  // Initialize edited content with content if it's empty
  useEffect(() => {
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
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Progress value={progress} className="w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder={placeholder}
        disabled={readOnly || isGenerating}
        className={`font-normal resize-none w-full ${minHeight ? `min-h-[${minHeight}]` : 'min-h-[300px]'} h-full`}
        readOnly={readOnly}
      />
    </div>
  );
};

export default AIContentEditor;
