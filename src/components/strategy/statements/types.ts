
export interface PainStatement {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAiGenerated: boolean;
  createdAt?: string;
}

export interface GainStatement {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAiGenerated: boolean;
  createdAt?: string;
}

export interface StatementFormValues {
  content: string;
  impact: 'low' | 'medium' | 'high';
}
