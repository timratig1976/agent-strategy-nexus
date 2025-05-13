
# AI Generator Components

This directory contains a set of reusable React components for building AI-powered content generation interfaces. These components are designed to be modular, consistent, and easy to integrate into various parts of the application.

## Core Components

### AIGeneratorPanel

The main container component that combines all the AI generation UI elements.

```tsx
import { AIGeneratorPanel } from '@/components/ai-generator';

// Usage example
<AIGeneratorPanel
  title="Generate Marketing Briefing"
  latestResult={latestBriefing}
  editedContent={editedContent}
  setEditedContent={setEditedContent}
  enhancementText={enhancementText}
  setEnhancementText={setEnhancementText}
  isGenerating={isGenerating}
  progress={progress}
  generationHistory={briefingHistory}
  aiDebugInfo={aiDebugInfo}
  error={error}
  generateContent={generateBriefing}
  handleSaveContent={handleSaveBriefing}
  enhancerExpanded={enhancerExpanded}
  toggleEnhancerExpanded={toggleEnhancerExpanded}
  showPromptMonitor={showPromptMonitor}
  togglePromptMonitor={togglePromptMonitor}
  generateButtonText="Generate Briefing"
  saveButtonText="Save Draft"
  saveFinalButtonText="Save Final Version"
  placeholderText="Your marketing briefing will appear here..."
/>
```

### Individual Components

You can also use the components individually for more customized layouts:

- **AIInstructionsInput**: For custom AI instructions input
- **AIContentEditor**: For editing AI-generated content
- **AIActionBar**: For save and action buttons
- **AIHistoryViewer**: For viewing generation history
- **AIDebugMonitor**: For debugging AI prompts and responses

## Custom Hook

### useAIGenerator

A custom hook that manages AI generation state and actions.

```tsx
import { useAIGenerator } from '@/components/ai-generator';

// Usage example
const {
  isGenerating,
  progress,
  error,
  aiDebugInfo,
  generationHistory,
  latestGeneration,
  editedContent,
  enhancementText,
  enhancerExpanded,
  setEditedContent,
  setEnhancementText,
  generateContent,
  saveContent,
  toggleEnhancerExpanded
} = useAIGenerator({
  strategyId: 'strategy-id',
  module: 'briefing',
  initialHistory: [],
  onSaveSuccess: (result, isFinal) => {
    console.log('Save success', result, isFinal);
  },
  fetchGenerationHistory: async () => {
    // Fetch history from API
    return [];
  },
  saveGenerationResult: async (content, isFinal) => {
    // Save content to API
    return null;
  },
  generateFunction: async (enhancementText) => {
    // Generate content using AI
    return { content: 'Generated content' };
  }
});
```

## Integration Example

Here's a complete example of how to integrate the AI generator components into a page:

```tsx
import React, { useState, useEffect } from 'react';
import { AIGeneratorPanel, useAIGenerator } from '@/components/ai-generator';
import { AgentCoreService } from '@/services/ai/agentCoreService';

const MyAIGeneratorPage = ({ strategyId }) => {
  // Use the AI generator hook
  const {
    isGenerating,
    progress,
    error,
    aiDebugInfo,
    generationHistory,
    latestGeneration,
    editedContent,
    enhancementText,
    enhancerExpanded,
    setEditedContent,
    setEnhancementText,
    generateContent,
    saveContent,
    toggleEnhancerExpanded,
    togglePromptMonitor,
    showPromptMonitor
  } = useAIGenerator({
    strategyId,
    module: 'my-module',
    fetchGenerationHistory: async () => {
      // Fetch history from API
      const { data } = await AgentCoreService.getResults(strategyId, 'my-module');
      return data || [];
    },
    saveGenerationResult: async (content, isFinal) => {
      // Save content to API
      return await AgentCoreService.saveAgentResult(
        strategyId, 
        content, 
        { type: 'my-module', is_final: isFinal }, 
        null
      );
    },
    generateFunction: async (enhancementText) => {
      // Generate content using AI
      const { data } = await AgentCoreService.generateContent(
        strategyId,
        'my-module',
        { enhancementText }
      );
      return { content: data?.content || '' };
    }
  });

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">My AI Generator</h1>
      
      <AIGeneratorPanel
        title="Generate Content"
        latestResult={latestGeneration}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        enhancementText={enhancementText}
        setEnhancementText={setEnhancementText}
        isGenerating={isGenerating}
        progress={progress}
        generationHistory={generationHistory}
        aiDebugInfo={aiDebugInfo}
        error={error}
        generateContent={generateContent}
        handleSaveContent={saveContent}
        enhancerExpanded={enhancerExpanded}
        toggleEnhancerExpanded={toggleEnhancerExpanded}
        showPromptMonitor={showPromptMonitor}
        togglePromptMonitor={togglePromptMonitor}
      />
    </div>
  );
};

export default MyAIGeneratorPage;
```

## Best Practices

1. **Consistent Naming**: Use consistent names for your AI generation functions and variables.
2. **Error Handling**: Always handle errors gracefully and provide feedback to users.
3. **Progress Feedback**: Use the progress indicator to show users that something is happening.
4. **Modular Approach**: Use individual components when you need more control over the layout.
5. **Type Safety**: Use TypeScript interfaces to ensure type safety when using these components.

## Extending the Components

To add new functionality:

1. Update the type definitions in `types.ts`.
2. Modify the relevant components or create new ones.
3. Update the documentation to reflect the changes.
