
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { BriefingProgressBar } from "../briefing/components/BriefingProgressBar";

interface PersonaEditorProps {
  content: string;
  readOnly?: boolean;
  editedContent?: string;
  setEditedContent?: React.Dispatch<React.SetStateAction<string>>;
  isGenerating?: boolean;
  progress?: number;
}

const PersonaEditor: React.FC<PersonaEditorProps> = ({ 
  content, 
  readOnly = false,
  editedContent,
  setEditedContent,
  isGenerating = false,
  progress = 0
}) => {
  // For editable content, use the editor
  if (!readOnly && setEditedContent) {
    return (
      <>
        {isGenerating ? (
          <div className="relative min-h-[300px] bg-muted/20 rounded-md p-4">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            <BriefingProgressBar progress={progress} />
          </div>
        ) : (
          <Textarea
            className="min-h-[300px] font-mono text-sm"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Generated persona will appear here..."
            readOnly={isGenerating}
          />
        )}
      </>
    );
  }
  
  // For read-only content, use the markdown renderer
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown>
        {content || "No content available"}
      </ReactMarkdown>
    </div>
  );
};

export default PersonaEditor;
