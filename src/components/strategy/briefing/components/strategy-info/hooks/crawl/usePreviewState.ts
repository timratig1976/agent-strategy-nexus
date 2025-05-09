
import { useState } from "react";

/**
 * Hook to manage preview visibility state
 */
export const usePreviewState = () => {
  const [showWebsitePreview, setShowWebsitePreview] = useState<boolean>(false);
  const [showProductPreview, setShowProductPreview] = useState<boolean>(false);

  return {
    showWebsitePreview,
    showProductPreview,
    setShowWebsitePreview,
    setShowProductPreview
  };
};
