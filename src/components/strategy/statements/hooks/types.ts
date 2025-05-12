
import { PainStatement, GainStatement } from "../types";

export interface UseStatementsDataProps {
  strategyId: string;
}

export interface UseStatementsDataReturn {
  painStatements: PainStatement[];
  gainStatements: GainStatement[];
  addPainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  addGainStatement: (content: string, impact: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updatePainStatement: (id: string, updates: Partial<PainStatement>) => void;
  updateGainStatement: (id: string, updates: Partial<GainStatement>) => void;
  deletePainStatement: (id: string) => void;
  deleteGainStatement: (id: string) => void;
  saveStatements: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export interface StrategyStatementRow {
  id: string;
  strategy_id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  is_ai_generated: boolean;
  statement_type: 'pain' | 'gain';
  created_at: string;
}
