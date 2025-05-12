
// Map of module IDs to their display names and descriptions for use in the AI prompt settings UI

export const moduleLabels: Record<string, { 
  title: { [key: string]: string }, 
  description: { [key: string]: string } 
}> = {
  briefing: {
    title: {
      english: 'Project Briefing',
      deutsch: 'Projektbriefing'
    },
    description: {
      english: 'AI prompts for generating marketing strategy briefings',
      deutsch: 'KI-Prompts für die Erstellung von Marketing-Strategie-Briefings'
    }
  },
  persona: {
    title: {
      english: 'Persona Development',
      deutsch: 'Persona-Entwicklung'
    },
    description: {
      english: 'AI prompts for generating customer personas',
      deutsch: 'KI-Prompts für die Erstellung von Kundenpersonas'
    }
  },
  usp_canvas: {
    title: {
      english: 'USP Canvas',
      deutsch: 'USP Canvas'
    },
    description: {
      english: 'AI prompts for generating USP canvas content',
      deutsch: 'KI-Prompts für die Erstellung von USP-Canvas-Inhalten'
    }
  },
  statements: {
    title: {
      english: 'Pain & Gain Statements',
      deutsch: 'Pain & Gain Statements'
    },
    description: {
      english: 'AI prompts for generating pain and gain statements',
      deutsch: 'KI-Prompts für die Erstellung von Pain & Gain Statements'
    }
  },
  campaign: {
    title: {
      english: 'Campaign Ideas',
      deutsch: 'Kampagnenideen'
    },
    description: {
      english: 'AI prompts for generating marketing campaign ideas',
      deutsch: 'KI-Prompts für die Erstellung von Marketing-Kampagnenideen'
    }
  },
  ads: {
    title: {
      english: 'Ad Creatives',
      deutsch: 'Werbeanzeigen'
    },
    description: {
      english: 'AI prompts for generating ad creative concepts',
      deutsch: 'KI-Prompts für die Erstellung von Werbekreativen'
    }
  }
};
