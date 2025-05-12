import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddStatementFormProps {
  type: 'pain' | 'gain';
  onAdd: (content: string, impact: 'low' | 'medium' | 'high') => void;
}

const AddStatementForm: React.FC<AddStatementFormProps> = ({ type, onAdd }) => {
  const [content, setContent] = useState('');
  const [impact, setImpact] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content.trim(), impact);
      setContent('');
      // Keep the selected impact level for convenience
    }
  };

  const typeLabel = type === 'pain' ? 'Pain Statement' : 'Gain Statement';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add {typeLabel}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`${type}-content`}>Statement Content</Label>
              <Textarea
                id={`${type}-content`}
                placeholder={`Enter ${type} statement...`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Impact Level</Label>
              <RadioGroup value={impact} onValueChange={(v) => setImpact(v as 'low' | 'medium' | 'high')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id={`${type}-low`} />
                  <Label htmlFor={`${type}-low`}>Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id={`${type}-medium`} />
                  <Label htmlFor={`${type}-medium`}>Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id={`${type}-high`} />
                  <Label htmlFor={`${type}-high`}>High</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Add {typeLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddStatementForm;
