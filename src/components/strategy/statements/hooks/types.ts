
import { PainStatement, GainStatement } from "../types";

export interface UseStatementsDataProps {
  strategyId: string;
  onChanges?: (hasChanges: boolean) => void;
}

export interface UseStatementsDataReturn {
  painStatements: PainStatement[];
  gainStatements: GainStatement[];
  addPainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAiGenerated?: boolean) => void;
  addGainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAiGenerated?: boolean) => void;
  updatePainStatement: (id: string, updates: Partial<PainStatement>) => void;
  updateGainStatement: (id: string, updates: Partial<GainStatement>) => void;
  deletePainStatement: (id: string) => void;
  deleteGainStatement: (id: string) => void;
  saveStatements: (isFinal?: boolean) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
  hasLocalChanges: boolean;
  setHasLocalChanges: (value: boolean) => void;
}

export interface StrategyStatementRow {
  id: string;
  strategy_id: string;
  content: string;
  impact: string;
  is_ai_generated: boolean;
  statement_type: 'pain' | 'gain';
  created_at: string;
  updated_at?: string;
}
