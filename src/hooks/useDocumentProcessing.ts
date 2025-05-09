
import { useCallback } from "react";
import { useDocumentContent } from "./useDocumentContent";
import { useWebsiteCrawlData } from "./useWebsiteCrawlData";
import { usePromptManager } from "./usePromptManager";

/**
 * Combined hook for document processing that leverages more focused hooks
 */
export const useDocumentProcessing = (strategyId: string) => {
  const { getDocumentContentForAI } = useDocumentContent(strategyId);
  const { getWebsiteCrawlDataForAI } = useWebsiteCrawlData(strategyId);
  const { ensurePromptsExist } = usePromptManager();

  return {
    getDocumentContentForAI,
    getWebsiteCrawlDataForAI,
    ensurePromptsExist
  };
};
