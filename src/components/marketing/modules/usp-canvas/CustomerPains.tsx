
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CustomerPain } from './types';
import { Trash2, Plus } from "lucide-react";

interface CustomerPainsProps {
  pains: CustomerPain[];
  onAdd: (content: string, severity: 'low' | 'medium' | 'high') => void;
  onUpdate: (id: string, content: string, severity: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
}

const CustomerPains = ({ pains, onAdd, onUpdate, onDelete }: CustomerPainsProps) => {
  const [newPainContent, setNewPainContent] = useState('');
  const [newPainSeverity, setNewPainSeverity] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddPain = () => {
    if (newPainContent.trim()) {
      onAdd(newPainContent.trim(), newPainSeverity);
      setNewPainContent('');
      setNewPainSeverity('medium');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-red-800 mb-2">What are Customer Pains?</h3>
        <p className="text-sm text-red-700">
          Pains describe the negative outcomes, risks, and obstacles customers encounter during their jobs. 
          These can be functional pains, emotional pains, or ancillary pains that create frustration.
        </p>
      </div>

      <div className="space-y-4">
        {pains.map((pain) => (
          <div key={pain.id} className="flex items-start space-x-3 p-3 bg-white border rounded-md">
            <div className="flex-1">
              <Input 
                value={pain.content}
                onChange={(e) => onUpdate(pain.id, e.target.value, pain.severity)}
                placeholder="What pains do your customers experience?"
                className="mb-2"
              />
              <RadioGroup 
                value={pain.severity} 
                onValueChange={(value) => onUpdate(pain.id, pain.content, value as 'low' | 'medium' | 'high')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="low" id={`pain-${pain.id}-low`} />
                  <Label htmlFor={`pain-${pain.id}-low`} className="text-xs">Low Severity</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="medium" id={`pain-${pain.id}-medium`} />
                  <Label htmlFor={`pain-${pain.id}-medium`} className="text-xs">Medium Severity</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="high" id={`pain-${pain.id}-high`} />
                  <Label htmlFor={`pain-${pain.id}-high`} className="text-xs">High Severity</Label>
                </div>
              </RadioGroup>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(pain.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex space-x-3 items-end">
        <div className="flex-1 space-y-2">
          <Input 
            value={newPainContent}
            onChange={(e) => setNewPainContent(e.target.value)}
            placeholder="Add a new customer pain..."
          />
          <RadioGroup 
            value={newPainSeverity} 
            onValueChange={(value) => setNewPainSeverity(value as 'low' | 'medium' | 'high')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="low" id="new-pain-low" />
              <Label htmlFor="new-pain-low" className="text-xs">Low Severity</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="medium" id="new-pain-medium" />
              <Label htmlFor="new-pain-medium" className="text-xs">Medium Severity</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="high" id="new-pain-high" />
              <Label htmlFor="new-pain-high" className="text-xs">High Severity</Label>
            </div>
          </RadioGroup>
        </div>
        <Button 
          onClick={handleAddPain}
          disabled={!newPainContent.trim()}
          className="mb-1"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Pain
        </Button>
      </div>
    </div>
  );
};

export default CustomerPains;
