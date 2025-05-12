
export interface PainStatement {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAiGenerated: boolean;
}

export interface GainStatement {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAiGenerated: boolean;
}
