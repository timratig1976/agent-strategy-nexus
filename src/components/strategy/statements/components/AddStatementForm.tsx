
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatementForm from './StatementForm';
import { StatementFormValues } from '../types';

interface AddStatementFormProps {
  type: 'pain' | 'gain';
  onAdd: (content: string, impact: 'low' | 'medium' | 'high') => void;
}

const AddStatementForm: React.FC<AddStatementFormProps> = ({ type, onAdd }) => {
  const handleSubmit = (values: StatementFormValues) => {
    onAdd(values.content, values.impact);
  };

  const isPain = type === 'pain';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {isPain ? 'Add Pain Statement' : 'Add Gain Statement'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StatementForm
          onSubmit={handleSubmit}
          placeholder={isPain 
            ? 'E.g., Customers struggle with organizing their tasks efficiently...' 
            : 'E.g., Customers desire a simplified workflow that saves time...'}
        />
      </CardContent>
    </Card>
  );
};

export default AddStatementForm;
