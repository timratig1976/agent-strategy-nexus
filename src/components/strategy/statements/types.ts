
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

export interface StatementsData {
  painStatements: PainStatement[];
  gainStatements: GainStatement[];
}

export interface StatementFormValues {
  content: string;
  impact: 'low' | 'medium' | 'high';
}
