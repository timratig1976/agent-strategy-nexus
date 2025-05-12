
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { StatementFormValues } from '../types';

interface StatementFormProps {
  onSubmit: (values: StatementFormValues) => void;
  initialValues?: StatementFormValues;
  placeholder?: string;
}

const StatementForm: React.FC<StatementFormProps> = ({ 
  onSubmit, 
  initialValues = { content: '', impact: 'medium' },
  placeholder = 'Enter statement content here...' 
}) => {
  const [content, setContent] = useState(initialValues.content);
  const [impact, setImpact] = useState<'low' | 'medium' | 'high'>(initialValues.impact);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({ content, impact });
      setContent('');
      setImpact('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Impact Level</Label>
        <RadioGroup 
          value={impact} 
          onValueChange={(value) => setImpact(value as 'low' | 'medium' | 'high')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low">Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high">High</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button type="submit">Add Statement</Button>
    </form>
  );
};

export default StatementForm;
