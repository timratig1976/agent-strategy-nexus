
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

export interface AIContentEditorProps {
  content: string;
  editedContent: string;
  setEditedContent: (content: string) => void;
  isGenerating: boolean;
  progress: number;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export interface AIInstructionsInputProps {
  enhancementText: string;
  setEnhancementText: (text: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  placeholder?: string;
  title?: string;
  description?: string;
}

export interface AIActionBarProps {
  onSave: () => Promise<any>;
  onSaveFinal: () => Promise<any>;
  isGenerating: boolean;
  saveButtonText?: string;
  saveFinalButtonText?: string;
  generationHistory?: AIGenerationResult[];
  onSelectHistoricalVersion?: (content: string) => void;
  aiDebugInfo?: any;
  showPromptMonitor?: boolean;
  togglePromptMonitor?: () => void;
}

export interface AIHistoryViewerProps<T = AIGenerationResult> {
  generationHistory: T[];
  onSelectHistoricalVersion: (content: string) => void;
  title?: string;
}

export interface AIDebugMonitorProps {
  debugInfo: any;
  title?: string;
}
