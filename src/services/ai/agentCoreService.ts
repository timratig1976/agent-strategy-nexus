
import { PromptManager } from './core';

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
}
