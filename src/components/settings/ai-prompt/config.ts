
export interface ModuleLabel {
  title: {
    english: string;
  };
  description: {
    english: string;
  };
}

export interface AIPromptModules {
  [key: string]: ModuleLabel;
}

export const moduleLabels: AIPromptModules = {
  briefing: {
    title: {
      english: "Strategy Briefing Prompts",
    },
    description: {
      english: "Customize how the AI generates strategy briefings",
    }
  },
  persona: {
    title: {
      english: "Persona Development Prompts",
    },
    description: {
      english: "Customize how the AI creates customer personas",
    }
  },
  content_strategy: {
    title: {
      english: "Content Strategy Prompts",
    },
    description: {
      english: "Customize how the AI develops content strategies",
    }
  },
  usp_canvas_profile: {
    title: {
      english: "USP Canvas Profile Prompts",
    },
    description: {
      english: "Customize how the AI generates customer profile elements (jobs, pains, gains)",
    }
  },
  usp_canvas_value_map: {
    title: {
      english: "USP Canvas Value Map Prompts",
    },
    description: {
      english: "Customize how the AI generates value map elements (products, pain relievers, gain creators)",
    }
  }
};
