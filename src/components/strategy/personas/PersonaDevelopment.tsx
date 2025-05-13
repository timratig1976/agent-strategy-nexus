import React from "react";
import { PersonaDevelopmentProps } from "./types";
import BriefingResult from "../briefing/components/briefing-result/BriefingResult";
import { PersonaHeader, BriefingDisplay } from "./components";
import { usePersonaDevelopment } from "./hooks/usePersonaDevelopment";
import { usePersonaNavigation } from "./hooks/usePersonaNavigation";

const PersonaDevelopment: React.FC<PersonaDevelopmentProps> = ({ 
  strategy, 
  agentResults = [],
  briefingAgentResult
}) => {
  // Find the latest briefing from the history or use the provided one
  const latestBriefing = briefingAgentResult || 
    (agentResults.filter(r => r.metadata?.type === 'briefing' || !r.metadata?.type).length > 0 
      ? agentResults.filter(r => r.metadata?.type === 'briefing' || !r.metadata?.type)[0] 
      : null);
  
  // Use our custom hooks
  const { 
    personaHistory,
    setPersonaHistory,
    latestPersona,
    isGenerating,
    progress,
    aiDebugInfo,
    hasFinalPersona,
    generatePersona,
    savePersonaResult
  } = usePersonaDevelopment(strategy.id, agentResults);
  
  const { 
    handleGoToPreviousStep,
    handleGoToNextStep 
  } = usePersonaNavigation(strategy.id);
  
  return (
    <div className="space-y-6">
      {/* Header with navigation buttons */}
      <PersonaHeader 
        title="Persona Development"
        hasFinalPersona={hasFinalPersona}
        onPreviousStep={handleGoToPreviousStep}
        onNextStep={handleGoToNextStep}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Briefing Information */}
        <div>
          <BriefingDisplay 
            briefing={latestBriefing}
          />
        </div>
        
        {/* Right side - Persona Generation */}
        <div>
          <BriefingResult 
            latestBriefing={latestPersona || null}
            isGenerating={isGenerating}
            progress={progress}
            generateBriefing={generatePersona}
            saveAgentResult={savePersonaResult}
            briefingHistory={personaHistory}
            setBriefingHistory={setPersonaHistory}
            aiDebugInfo={aiDebugInfo}
            customTitle="Persona Generator"
            generateButtonText="Generate Persona"
            saveButtonText="Save Persona Draft"
            saveFinalButtonText="Save Final Persona"
            placeholderText="Generated personas will appear here..."
            onBriefingSaved={(isFinal) => {
              if (isFinal) console.log("Final persona saved");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonaDevelopment;
