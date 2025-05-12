
export interface BaseStatement {
  id: string;
  content: string;
  isAIGenerated?: boolean;
}

export interface PainStatement extends BaseStatement {
  impact: 'low' | 'medium' | 'high';
}

export interface GainStatement extends BaseStatement {
  impact: 'low' | 'medium' | 'high';
}

export interface StatementFormValues {
  content: string;
  impact: 'low' | 'medium' | 'high';
}

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
