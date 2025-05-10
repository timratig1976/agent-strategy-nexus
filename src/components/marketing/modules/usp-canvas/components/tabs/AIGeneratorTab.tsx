
import React, { useState } from "react";
import { StoredAIResult, CanvasItem } from "../../types";
import UspCanvasAIGenerator from "../../UspCanvasAIGenerator";
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

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
          content: job.content,
          rating: job.priority || 'medium',
          isAIGenerated: true
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas();
    toast.success(`Added ${jobs.length} jobs to Customer Profile`);
  };

  // Handle adding pain items to canvas
  const handleAddAIPains = (pains: any[]) => {
    if (!pains || pains.length === 0) return;
    
    const newCustomerItems = [...customerItems];
    
    pains.forEach(pain => {
      if (pain.content) {
        newCustomerItems.push({
          id: uuidv4(),
          content: pain.content,
          rating: pain.severity || 'medium',
          isAIGenerated: true
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas();
    toast.success(`Added ${pains.length} pains to Customer Profile`);
  };

  // Handle adding gain items to canvas
  const handleAddAIGains = (gains: any[]) => {
    if (!gains || gains.length === 0) return;
    
    const newCustomerItems = [...customerItems];
    
    gains.forEach(gain => {
      if (gain.content) {
        newCustomerItems.push({
          id: uuidv4(),
          content: gain.content,
          rating: gain.importance || 'medium',
          isAIGenerated: true
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas();
    toast.success(`Added ${gains.length} gains to Customer Profile`);
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
