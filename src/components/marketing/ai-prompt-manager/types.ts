
import { AIPrompt } from "@/services/marketingAIService";

export interface ModuleOption {
  value: string;
  label: string;
}

export interface PromptFormProps {
  systemPrompt: string;
  userPrompt: string;
  isLoading: boolean;
  onChange: (field: 'systemPrompt' | 'userPrompt', value: string) => void;
}

export interface ModuleSelectorProps {
  selectedModule: string;
  moduleOptions: ModuleOption[];
  isLoading: boolean;
  onModuleChange: (value: string) => void;
}

export interface SaveButtonProps {
  isSaving: boolean;
  isLoading: boolean;
  onSave: () => void;
}
