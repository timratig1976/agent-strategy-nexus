
import React from 'react';
import { PainStatement, GainStatement, StatementFormValues } from '../types';
import StatementItem from './StatementItem';
import StatementForm from './StatementForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatementsListProps {
  title: string;
  statements: PainStatement[] | GainStatement[];
  onAddStatement: (content: string, impact: 'low' | 'medium' | 'high') => void;
  onDeleteStatement: (id: string) => void;
  placeholder?: string;
}

const StatementsList: React.FC<StatementsListProps> = ({
  title,
  statements,
  onAddStatement,
  onDeleteStatement,
  placeholder
}) => {
  const handleSubmit = (values: StatementFormValues) => {
    onAddStatement(values.content, values.impact);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {statements.length > 0 ? (
          <div className="space-y-4">
            {statements.map((statement) => (
              <StatementItem
                key={statement.id}
                id={statement.id}
                content={statement.content}
                impact={statement.impact}
                isAIGenerated={statement.isAIGenerated}
                onDelete={onDeleteStatement}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No statements added yet. Add one below or generate with AI.
          </div>
        )}

        <StatementForm 
          onSubmit={handleSubmit}
          placeholder={placeholder}
        />
      </CardContent>
    </Card>
  );
};

export default StatementsList;
