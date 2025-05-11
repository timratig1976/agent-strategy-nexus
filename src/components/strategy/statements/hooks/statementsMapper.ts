
import { StrategyStatementRow } from './types';
import { PainStatement, GainStatement } from '../types';

/**
 * Map database rows to pain statements
 */
export const mapToPainStatements = (rows: StrategyStatementRow[]): PainStatement[] => {
  return rows
    .filter(item => item.statement_type === 'pain')
    .map(item => ({
      id: item.id,
      content: item.content,
      impact: item.impact,
      isAIGenerated: item.is_ai_generated,
      createdAt: item.created_at
    }));
};

/**
 * Map database rows to gain statements
 */
export const mapToGainStatements = (rows: StrategyStatementRow[]): GainStatement[] => {
  return rows
    .filter(item => item.statement_type === 'gain')
    .map(item => ({
      id: item.id,
      content: item.content,
      impact: item.impact,
      isAIGenerated: item.is_ai_generated,
      createdAt: item.created_at
    }));
};
