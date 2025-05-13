
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";
import { AIActionBarProps } from "./types";
import AIHistoryViewer from "./AIHistoryViewer";

/**
 * Component for save and action buttons in AI generators
 */
const AIActionBar: React.FC<AIActionBarProps> = ({
  onSave,
  onSaveFinal,
  isGenerating,
  saveButtonText = "Save Draft",
  saveFinalButtonText = "Save as Final",
  generationHistory,
  onSelectHistoricalVersion,
  aiDebugInfo,
  showPromptMonitor,
  togglePromptMonitor
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showFinalSuccess, setShowFinalSuccess] = useState(false);

  useEffect(() => {
    // Reset success state after 1.5 seconds
    let saveTimer: NodeJS.Timeout;
    let finalTimer: NodeJS.Timeout;
    
    if (showSaveSuccess) {
      saveTimer = setTimeout(() => {
        setShowSaveSuccess(false);
      }, 1500);
    }
    
    if (showFinalSuccess) {
      finalTimer = setTimeout(() => {
        setShowFinalSuccess(false);
      }, 1500);
    }
    
    return () => {
      clearTimeout(saveTimer);
      clearTimeout(finalTimer);
    };
  }, [showSaveSuccess, showFinalSuccess]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setShowSaveSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFinal = async () => {
    setIsFinalizing(true);
    try {
      await onSaveFinal();
      setShowFinalSuccess(true);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div>
        {generationHistory && onSelectHistoricalVersion && (
          <AIHistoryViewer 
            generationHistory={generationHistory}
            onSelectHistoricalVersion={onSelectHistoricalVersion}
          />
        )}
      </div>
      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isGenerating || isSaving || showSaveSuccess}
          variant="outline"
          className="flex items-center gap-2"
        >
          {showSaveSuccess ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {showSaveSuccess ? "Saved" : (isSaving ? "Saving..." : saveButtonText)}
        </Button>
        
        <Button
          onClick={handleSaveFinal}
          disabled={isGenerating || isFinalizing || showFinalSuccess}
          className="flex items-center gap-2"
        >
          {showFinalSuccess ? (
            <Check className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {showFinalSuccess ? "Saved Final" : (isFinalizing ? "Finalizing..." : saveFinalButtonText)}
        </Button>
      </div>
    </div>
  );
};

export default AIActionBar;
