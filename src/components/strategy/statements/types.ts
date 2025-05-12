
export interface PainStatement {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
  createdAt: string;
}

export interface GainStatement {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
  createdAt: string;
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

export interface StatementCategory {
  id: string;
  name: string;
  color: string;
}

export interface StatementFormValues {
  content: string;
  impact: 'low' | 'medium' | 'high';
}
