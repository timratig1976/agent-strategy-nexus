
export interface BaseStatement {
  id: string;
  content: string;
  isAIGenerated?: boolean;
  impact: 'low' | 'medium' | 'high';
  createdAt?: string; // Add createdAt property
}

export interface PainStatement extends BaseStatement {
  // No need for additional fields as they inherit from BaseStatement
}

export interface GainStatement extends BaseStatement {
  // No need for additional fields as they inherit from BaseStatement
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
