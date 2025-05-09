
import React from "react";
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
  placeholder = "The AI will generate marketing briefing content here..."
}) => {
  // Initialize edited content with content if it's empty
  React.useEffect(() => {
    if (content && !editedContent) {
      setEditedContent(content);
    }
  }, [content, editedContent, setEditedContent]);

  return (
    <div className="h-full">
      <Textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        placeholder={placeholder}
        disabled={isGenerating}
        className="min-h-[300px] h-full font-normal resize-none"
      />
    </div>
  );
};

export default BriefingContentEditor;
