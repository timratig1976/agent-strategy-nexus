
import { OutputLanguage } from "@/services/ai/types";

export interface ModuleLabel {
  title: Record<OutputLanguage, string>;
  description: Record<OutputLanguage, string>;
}

export interface AIPromptModules {
  [key: string]: ModuleLabel;
}

export const moduleLabels: AIPromptModules = {
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
