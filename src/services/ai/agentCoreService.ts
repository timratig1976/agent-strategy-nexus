
import { PromptManager, ResultManager } from './core';

/**
 * AgentCoreService is a facade that provides access to various AI agent services
 */
export class AgentCoreService {
  /**
   * Get default prompt templates
   */
  static getDefaultPromptTemplates(module: string) {
    return PromptManager.getDefaultPromptTemplates(module);
  }
  
  /**
   * Ensure that prompts exist for a given module
   * @param module The module name
   * @returns True if prompts exist or were created successfully
   */
  static async ensurePromptsExist(module: string): Promise<boolean> {
    return PromptManager.ensurePromptsExist(module);
  }
  
  /**
   * Get prompt templates for a module with fallback to defaults
   * @param module The module name
   * @returns The prompt templates or null if not available
   */
  static async getPrompts(module: string) {
    return PromptManager.getPrompts(module);
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
  ) {
    return ResultManager.saveAgentResult(strategyId, content, metadata, agentId);
  }
}
