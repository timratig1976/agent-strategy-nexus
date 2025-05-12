
import { PromptManager, ResultManager } from './core';
import { AgentResult } from "@/types/marketing";

export class AgentCoreService {
  /**
   * Get prompts for a module with fallback to defaults
   */
  static async getPrompts(module: string) {
    return await PromptManager.getPrompts(module);
  }
  
  /**
   * Ensure that prompts exist for a module
   */
  static async ensurePromptsExist(module: string) {
    return await PromptManager.ensurePromptsExist(module);
  }
  
  /**
   * Get default prompt templates for a module
   */
  static getDefaultPromptTemplates(module: string) {
    return PromptManager.getDefaultPromptTemplates(module);
  }

  /**
   * Save an agent result to the database
   * @param strategyId The strategy ID
   * @param content The content to save
   * @param metadata Additional metadata
   * @param agentId The agent ID (optional)
   * @returns The saved result or null if failed
   */
  static async saveAgentResult(
    strategyId: string,
    content: string,
    metadata: Record<string, any> = {},
    agentId: string | null = null
  ): Promise<AgentResult | null> {
    return await ResultManager.saveAgentResult(strategyId, content, metadata, agentId);
  }
}
