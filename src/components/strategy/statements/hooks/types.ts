
import { PainStatement, GainStatement } from '../types';

export interface UseStatementsDataProps {
  strategyId?: string;
}

// Define a TypeScript interface for the strategy_statements table row
export interface StrategyStatementRow {
  id: string;
  strategy_id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  is_ai_generated: boolean;
  statement_type: 'pain' | 'gain';
  created_at: string;
}

export interface UseStatementsDataReturn {
  painStatements: PainStatement[];
  gainStatements: GainStatement[];
  addPainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  addGainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updatePainStatement: (id: string, content: string, impact: 'low' | 'medium' | 'high') => void;
  updateGainStatement: (id: string, content: string, impact: 'low' | 'medium' | 'high') => void;
  deletePainStatement: (id: string) => void;
  deleteGainStatement: (id: string) => void;
  saveStatements: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  loadStatements: () => Promise<void>;
}
