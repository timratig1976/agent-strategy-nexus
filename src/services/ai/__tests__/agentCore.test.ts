
/**
 * This file exists primarily for typecheck testing
 */

import { AgentCoreService } from '../agentCoreService';
import { PromptManager, ResultManager } from '../core';

// We're just testing the types here, not actual functionality
async function typecheckTest() {
  // Test PromptManager
  const template = PromptManager.getDefaultPromptTemplates('briefing');
  const promptExists = await PromptManager.ensurePromptsExist('briefing');
  const prompts = await PromptManager.getPrompts('briefing');

  // Test ResultManager
  const result = await ResultManager.saveAgentResult(
    'strategy-id',
    'Content',
    { is_final: true, type: 'briefing' }
  );

  // Test AgentCoreService facade
  const template2 = AgentCoreService.getDefaultPromptTemplates('briefing');
  const promptExists2 = await AgentCoreService.ensurePromptsExist('briefing');
  const prompts2 = await AgentCoreService.getPrompts('briefing');
  const result2 = await AgentCoreService.saveAgentResult(
    'strategy-id',
    'Content',
    { is_final: true, type: 'briefing' }
  );
}
