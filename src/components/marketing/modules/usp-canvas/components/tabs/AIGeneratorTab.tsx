
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
      if (job.content || job.description) {
        newCustomerItems.push({
          id: `job-${uuidv4()}`, // Ensure consistent prefix for jobs
          content: job.content || job.description,
          rating: job.priority || 'medium',
          isAIGenerated: true
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas().then(() => {
      toast.success(`Added ${jobs.length} jobs to Customer Profile`);
      console.log('After adding jobs, customerItems:', newCustomerItems);
    });
  };

  // Handle adding pain items to canvas
  const handleAddAIPains = (pains: any[]) => {
    if (!pains || pains.length === 0) return;
    
    const newCustomerItems = [...customerItems];
    
    pains.forEach(pain => {
      if (pain.content || pain.description) {
        newCustomerItems.push({
          id: `pain-${uuidv4()}`, // Ensure consistent prefix for pains
          content: pain.content || pain.description,
          rating: pain.severity || 'medium',
          isAIGenerated: true
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas().then(() => {
      toast.success(`Added ${pains.length} pains to Customer Profile`);
      console.log('After adding pains, customerItems:', newCustomerItems);
    });
  };

  // Handle adding gain items to canvas
  const handleAddAIGains = (gains: any[]) => {
    if (!gains || gains.length === 0) return;
    
    const newCustomerItems = [...customerItems];
    
    gains.forEach(gain => {
      if (gain.content || gain.description) {
        newCustomerItems.push({
          id: `gain-${uuidv4()}`, // Ensure consistent prefix for gains
          content: gain.content || gain.description,
          rating: gain.importance || 'medium',
          isAIGenerated: true
        });
      }
    });
    
    setCustomerItems(newCustomerItems);
    onSaveCanvas().then(() => {
      toast.success(`Added ${gains.length} gains to Customer Profile`);
      console.log('After adding gains, customerItems:', newCustomerItems);
    });
  };

  // Handle AI results generated
  const handleAIResultsGenerated = (results: StoredAIResult) => {
    console.log("AI results generated:", results);
    setStoredAIResult(results);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem(
        `usp_canvas_${canvasId}_ai_results`, 
        JSON.stringify({ data: results, timestamp: Date.now() })
      );
    } catch (err) {
      console.error('Error saving AI results:', err);
    }
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
