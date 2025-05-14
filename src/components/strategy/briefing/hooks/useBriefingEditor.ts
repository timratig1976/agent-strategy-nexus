
import { useState, useEffect } from 'react';

interface UseBriefingEditorOptions {
  initialContent: string;
  isGenerating: boolean;
}

export const useBriefingEditor = ({
  initialContent, 
  isGenerating
}: UseBriefingEditorOptions) => {
  const [editedContent, setEditedContent] = useState<string>(initialContent);
  
  // Update edited content when the initial content changes
  useEffect(() => {
    if (initialContent) {
      setEditedContent(initialContent);
    }
  }, [initialContent]);
  
  // Reset content to initial state
  const resetContent = () => {
    setEditedContent(initialContent);
  };
  
  return {
    editedContent,
    setEditedContent,
    resetContent
  };
};
