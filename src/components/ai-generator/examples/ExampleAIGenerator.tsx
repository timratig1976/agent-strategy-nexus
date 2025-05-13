
import React from 'react';
import { AIGeneratorPanel, useAIGenerator } from '@/components/ai-generator';

interface ExampleAIGeneratorProps {
  strategyId: string;
}

/**
 * Example implementation of the AI Generator components
 */
const ExampleAIGenerator: React.FC<ExampleAIGeneratorProps> = ({ strategyId }) => {
  // Mock data and functions for demonstration
  const mockGenerateContent = async (enhancementText?: string) => {
    console.log('Generating content with instructions:', enhancementText);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { 
      content: `This is an example of generated content based on your instructions: "${enhancementText || 'No special instructions'}".\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.`,
      metadata: {
        timestamp: new Date().toISOString(),
        model: 'example-model',
        tokens: 150
      }
    };
  };
  
  const mockSaveContent = async (content: string, isFinal: boolean) => {
    console.log('Saving content as', isFinal ? 'final' : 'draft');
    console.log('Content:', content);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Updated to match the expected void return type
    const result = {
      id: `example-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      metadata: {
        is_final: isFinal,
        version: 1,
        type: 'example'
      }
    };
    
    // Return the result but allow it to be treated as void to match AIGeneratorPanel's expected type
    return result;
  };
  
  const mockFetchHistory = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'example-1',
        content: 'This is an example of a previously generated content.',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        metadata: {
          is_final: true,
          version: 1,
          type: 'example'
        }
      },
      {
        id: 'example-2',
        content: 'This is another example of a previously generated content.',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        metadata: {
          is_final: false,
          version: 0,
          type: 'example'
        }
      }
    ];
  };
  
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
    showPromptMonitor,
    setEditedContent,
    setEnhancementText,
    generateContent,
    saveContent,
    toggleEnhancerExpanded,
    togglePromptMonitor
  } = useAIGenerator({
    strategyId,
    module: 'example',
    fetchGenerationHistory: mockFetchHistory,
    saveGenerationResult: mockSaveContent,
    generateFunction: mockGenerateContent
  });
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Example AI Generator</h1>
      
      <AIGeneratorPanel
        title="Example Generator"
        latestResult={latestGeneration}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        enhancementText={enhancementText}
        setEnhancementText={setEnhancementText}
        isGenerating={isGenerating}
        progress={progress}
        generationHistory={generationHistory}
        aiDebugInfo={aiDebugInfo || {
          systemPrompt: "You are a helpful assistant that generates example content.",
          userPrompt: "Generate an example content with the following instructions: " + enhancementText,
          model: "example-model",
          processingTime: 1234
        }}
        error={error}
        generateContent={generateContent}
        handleSaveContent={saveContent}
        enhancerExpanded={enhancerExpanded}
        toggleEnhancerExpanded={toggleEnhancerExpanded}
        showPromptMonitor={showPromptMonitor}
        togglePromptMonitor={togglePromptMonitor}
        generateButtonText="Generate Example"
        saveButtonText="Save Example"
        saveFinalButtonText="Finalize Example"
        placeholderText="Your generated example will appear here..."
      />
    </div>
  );
};

export default ExampleAIGenerator;
