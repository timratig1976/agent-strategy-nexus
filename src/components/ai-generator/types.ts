export interface AIGenerationResult {
  id?: string;
  content: string;
  createdAt?: string;
  metadata?: Record<string, any>;
}

export interface AIGeneratorPanelProps {
  title: string;
  latestResult: AIGenerationResult | null;
  editedContent: string;
  setEditedContent: (content: string) => void;
  enhancementText: string;
  setEnhancementText: (text: string) => void;
  isGenerating: boolean;
  progress: number;
  generationHistory: AIGenerationResult[];
  aiDebugInfo?: any;
  error?: string | null;
  generateContent: (enhancementText?: string) => void;
  handleSaveContent: (isFinal: boolean) => Promise<AIGenerationResult | void>;
  enhancerExpanded: boolean;
  toggleEnhancerExpanded: () => void;
  showPromptMonitor: boolean;
  togglePromptMonitor: () => void;
  generateButtonText?: string;
  saveButtonText?: string;
  saveFinalButtonText?: string;
  placeholderText?: string;
}
