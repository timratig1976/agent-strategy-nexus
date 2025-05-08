
import React, { useState } from "react";
import { AIPromptSettings } from "@/components/settings";
import { OutputLanguage } from "@/services/ai/types";

interface AIPromptSettingsTabProps {
  language: OutputLanguage;
  onLanguageChange: (language: OutputLanguage) => void;
}

export const AIPromptSettingsTab: React.FC<AIPromptSettingsTabProps> = ({ 
  language, 
  onLanguageChange 
}) => {
  // Module titles and descriptions in both languages
  const moduleLabels = {
    briefing: {
      title: {
        english: "Strategy Briefing Prompts",
        deutsch: "Strategie-Briefing Prompts"
      },
      description: {
        english: "Customize how the AI generates strategy briefings",
        deutsch: "Passen Sie an, wie die KI Strategie-Briefings generiert"
      }
    },
    persona: {
      title: {
        english: "Persona Development Prompts",
        deutsch: "Persona-Entwicklung Prompts" 
      },
      description: {
        english: "Customize how the AI creates customer personas",
        deutsch: "Passen Sie an, wie die KI Kundenpersonas erstellt"
      }
    },
    content_strategy: {
      title: {
        english: "Content Strategy Prompts",
        deutsch: "Content-Strategie Prompts"
      },
      description: {
        english: "Customize how the AI develops content strategies",
        deutsch: "Passen Sie an, wie die KI Content-Strategien entwickelt"
      }
    },
    usp_canvas_profile: {
      title: {
        english: "USP Canvas Profile Prompts",
        deutsch: "USP Canvas Profil-Prompts"
      },
      description: {
        english: "Customize how the AI generates customer profile elements (jobs, pains, gains)",
        deutsch: "Passen Sie an, wie die KI Kundenprofilelemente generiert (Aufgaben, Probleme, Vorteile)"
      }
    },
    usp_canvas_value_map: {
      title: {
        english: "USP Canvas Value Map Prompts",
        deutsch: "USP Canvas Wertkarte-Prompts"
      },
      description: {
        english: "Customize how the AI generates value map elements (products, pain relievers, gain creators)",
        deutsch: "Passen Sie an, wie die KI Wertkarten-Elemente generiert (Produkte, Problemlöser, Vorteilsbringer)"
      }
    }
  };

  return (
    <div className="space-y-6">
      <AIPromptSettings
        module="briefing"
        title={moduleLabels.briefing.title[language]}
        description={moduleLabels.briefing.description[language]}
      />
      
      <AIPromptSettings
        module="persona"
        title={moduleLabels.persona.title[language]}
        description={moduleLabels.persona.description[language]}
      />
      
      <AIPromptSettings
        module="content_strategy"
        title={moduleLabels.content_strategy.title[language]}
        description={moduleLabels.content_strategy.description[language]}
      />
      
      <AIPromptSettings
        module="usp_canvas_profile"
        title={moduleLabels.usp_canvas_profile.title[language]}
        description={moduleLabels.usp_canvas_profile.description[language]}
      />
      
      <AIPromptSettings
        module="usp_canvas_value_map"
        title={moduleLabels.usp_canvas_value_map.title[language]}
        description={moduleLabels.usp_canvas_value_map.description[language]}
      />
    </div>
  );
};

export default AIPromptSettingsTab;

