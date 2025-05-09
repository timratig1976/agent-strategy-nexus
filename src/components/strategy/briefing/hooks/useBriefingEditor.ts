
import { useState, useEffect } from 'react';

interface UseBriefingEditorProps {
  initialContent: string;
  isGenerating: boolean;
}

export const useBriefingEditor = ({ initialContent, isGenerating }: UseBriefingEditorProps) => {
  const [editedContent, setEditedContent] = useState<string>(initialContent || '');

  // Update edited content when initialContent changes or generation completes
  useEffect(() => {
    if (initialContent && !isGenerating) {
      setEditedContent(initialContent);
    }
  }, [initialContent, isGenerating]);

  const resetContent = () => {
    setEditedContent(initialContent || '');
  };

  return {
    editedContent,
    setEditedContent,
    resetContent
  };
};
