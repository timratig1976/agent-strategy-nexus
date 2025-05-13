
import { ReactNode } from "react";

/**
 * Base result type that AI generators should extend
 */
export interface AIGenerationResult {
  id?: string;
  content: string;
  createdAt?: string | Date;
  metadata?: Record<string, any>;
}

/**
 * Common props for AI generator panels
 */
export interface AIGeneratorPanelProps<T extends AIGenerationResult = AIGenerationResult> {
  /** Title displayed at the top of the generator panel */
  title: string;
  /** The latest generated result */
  latestResult: T | null;
  /** Current edited content */
  editedContent: string;
  /** Function to update edited content */
  setEditedContent: (content: string) => void;
  /** Special instructions for the AI generator */
  enhancementText: string;
  /** Function to update enhancement text */
  setEnhancementText: (text: string) => void;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Generation progress percentage (0-100) */
  progress: number;
  /** History of previous generations */
  generationHistory: T[];
  /** Debug information for AI prompts and responses */
  aiDebugInfo?: any;
  /** Error message if generation failed */
  error: string | null;
  /** Function to trigger generation */
  generateContent: (enhancementText?: string) => void;
  /** Function to save content */
  handleSaveContent: (isFinal: boolean) => Promise<void>;
  /** Whether the instructions panel is expanded */
  enhancerExpanded: boolean;
  /** Function to toggle instructions panel */
  toggleEnhancerExpanded: () => void;
  /** Whether to show the prompt monitor */
  showPromptMonitor: boolean;
  /** Function to toggle prompt monitor */
  togglePromptMonitor: () => void;
  /** Text for generate button */
  generateButtonText?: string;
  /** Text for save draft button */
  saveButtonText?: string;
  /** Text for save final button */
  saveFinalButtonText?: string;
  /** Placeholder text for empty editor */
  placeholderText?: string;
}

/**
 * Props for the AI instructions input component
 */
export interface AIInstructionsInputProps {
  /** Current enhancement text */
  enhancementText: string;
  /** Function to update enhancement text */
  setEnhancementText: (text: string) => void;
  /** Whether the component is expanded */
  isExpanded?: boolean;
  /** Function to toggle expanded state */
  onToggleExpand?: () => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Optional title override */
  title?: string;
  /** Optional description */
  description?: string;
}

/**
 * Props for the AI content editor component
 */
export interface AIContentEditorProps {
  /** Original content from AI generation */
  content: string;
  /** Currently edited content */
  editedContent: string;
  /** Function to update edited content */
  setEditedContent: (content: string) => void;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Generation progress percentage (0-100) */
  progress: number;
  /** Placeholder text for empty editor */
  placeholder?: string;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Optional minimum height */
  minHeight?: string;
}

/**
 * Props for the AI action bar component
 */
export interface AIActionBarProps {
  /** Function to save content */
  onSave: () => Promise<void>;
  /** Function to save final content */
  onSaveFinal: () => Promise<void>;
  /** Whether generation is in progress */
  isGenerating: boolean;
  /** Text for save draft button */
  saveButtonText?: string;
  /** Text for save final button */
  saveFinalButtonText?: string;
  /** History of generations */
  generationHistory?: AIGenerationResult[];
  /** Function to select a historical version */
  onSelectHistoricalVersion?: (content: string) => void;
  /** Debug information for AI */
  aiDebugInfo?: any;
  /** Whether to show prompt monitor */
  showPromptMonitor?: boolean;
  /** Function to toggle prompt monitor */
  togglePromptMonitor?: () => void;
}

/**
 * Props for the AI history viewer component
 */
export interface AIHistoryViewerProps<T extends AIGenerationResult = AIGenerationResult> {
  /** History of generations */
  generationHistory: T[];
  /** Function to select a historical version */
  onSelectHistoricalVersion: (content: string) => void;
  /** Optional title override */
  title?: string;
}

/**
 * Props for the AI debug monitor component
 */
export interface AIDebugMonitorProps {
  /** Debug information object */
  debugInfo: any;
  /** Optional title override */
  title?: string;
}
