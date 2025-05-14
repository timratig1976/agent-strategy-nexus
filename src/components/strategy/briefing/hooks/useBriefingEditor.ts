
import { useState, useEffect } from "react";

interface UseBriefingEditorProps {
  initialContent: string;
  isGenerating: boolean;
}

export const useBriefingEditor = ({ 
  initialContent, 
  isGenerating 
}: UseBriefingEditorProps) => {
  const [editedContent, setEditedContent] = useState<string>(initialContent);
  const [originalContent, setOriginalContent] = useState<string>(initialContent);

  // Update editor content when initialContent changes
  useEffect(() => {
    if (initialContent && initialContent !== originalContent) {
      setEditedContent(initialContent);
      setOriginalContent(initialContent);
    }
  }, [initialContent, originalContent]);

  // Reset content to initial value
  const resetContent = () => {
    setEditedContent(initialContent);
  };

  return {
    editedContent,
    setEditedContent,
    originalContent,
    resetContent,
  };
};
