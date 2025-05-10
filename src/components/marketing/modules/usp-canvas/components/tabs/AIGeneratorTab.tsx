
import React, { useState } from "react";
import { StoredAIResult, CanvasItem } from "../../types";
import UspCanvasAIGenerator from "../../UspCanvasAIGenerator";
import { v4 as uuidv4 } from 'uuid';

interface AIGeneratorTabProps {
  canvasId: string;
  customerItems: CanvasItem[];
  valueItems: CanvasItem[];
  setCustomerItems: (items: CanvasItem[]) => void;
  setValueItems: (items: CanvasItem[]) => void;
  onSaveCanvas: () => Promise<void>;
  briefingContent?: string;
  personaContent?: string;
}

const AIGeneratorTab: React.FC<AIGeneratorTabProps> = ({
  canvasId,
  customerItems,
  valueItems,
  setCustomerItems,
  setValueItems,
  onSaveCanvas,
  briefingContent = '',
  personaContent = ''
}) => {
  // State for storing AI generated results
  const [storedAIResult, setStoredAIResult] = useState<StoredAIResult>({
    jobs: [],
    pains: [],
    gains: []
  });

  // Handle adding job items to canvas
  const handleAddAIJobs = (jobs: any[]) => {
    if (!jobs || jobs.length === 0) return;
    
    const newCustomerItems = [...customerItems];
    
    jobs.forEach(job => {
      if (job.content) {
        newCustomerItems.push({
          id: uuidv4(),
          type: 'job',
          content: job.content,
          priority: job.priority || 'medium',
          isAIGenerated: true,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas();
  };

  // Handle adding pain items to canvas
  const handleAddAIPains = (pains: any[]) => {
    if (!pains || pains.length === 0) return;
    
    const newCustomerItems = [...customerItems];
    
    pains.forEach(pain => {
      if (pain.content) {
        newCustomerItems.push({
          id: uuidv4(),
          type: 'pain',
          content: pain.content,
          severity: pain.severity || 'medium',
          isAIGenerated: true,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas();
  };

  // Handle adding gain items to canvas
  const handleAddAIGains = (gains: any[]) => {
    if (!gains || gains.length === 0) return;
    
    const newCustomerItems = [...customerItems];
    
    gains.forEach(gain => {
      if (gain.content) {
        newCustomerItems.push({
          id: uuidv4(),
          type: 'gain',
          content: gain.content,
          importance: gain.importance || 'medium',
          isAIGenerated: true,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas();
  };

  // Handle AI results generated
  const handleAIResultsGenerated = (results: StoredAIResult) => {
    setStoredAIResult(results);
  };

  return (
    <UspCanvasAIGenerator
      strategyId={canvasId}
      briefingContent={briefingContent}
      personaContent={personaContent}
      storedAIResult={storedAIResult}
      onAddJobs={handleAddAIJobs}
      onAddPains={handleAddAIPains}
      onAddGains={handleAddAIGains}
      onResultsGenerated={handleAIResultsGenerated}
    />
  );
};

export default AIGeneratorTab;
