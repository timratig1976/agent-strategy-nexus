
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
          Customer pains describe the negative emotions, undesired costs, situations, and risks 
          that your customers experience before, during, and after getting the job done.
          These are the obstacles and challenges they face.
        </p>
      </div>

      <div className="space-y-4">
        {pains.map((pain) => (
          <div key={pain.id} className="p-4 bg-white border rounded-md">
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-1">
                <Input 
                  value={pain.content}
                  onChange={(e) => onUpdate(pain.id, e.target.value, pain.severity)}
                  placeholder="What frustrates or annoys your customer?"
                />
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
            
            <div className="mt-3">
              <Label className="text-sm font-medium mb-2">Pain Severity:</Label>
              <RadioGroup 
                value={pain.severity} 
                onValueChange={(value) => onUpdate(pain.id, pain.content, value as 'low' | 'medium' | 'high')}
                className="flex space-x-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id={`pain-${pain.id}-low`} />
                  <Label htmlFor={`pain-${pain.id}-low`} className="text-sm">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id={`pain-${pain.id}-medium`} />
                  <Label htmlFor={`pain-${pain.id}-medium`} className="text-sm">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id={`pain-${pain.id}-high`} />
                  <Label htmlFor={`pain-${pain.id}-high`} className="text-sm">High</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border rounded-md space-y-4">
        <div>
          <Input 
            value={newPainContent}
            onChange={(e) => setNewPainContent(e.target.value)}
            placeholder="Add a new customer pain..."
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2">Pain Severity:</Label>
          <RadioGroup 
            value={newPainSeverity} 
            onValueChange={(value) => setNewPainSeverity(value as 'low' | 'medium' | 'high')}
            className="flex space-x-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="new-pain-low" />
              <Label htmlFor="new-pain-low" className="text-sm">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="new-pain-medium" />
              <Label htmlFor="new-pain-medium" className="text-sm">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="new-pain-high" />
              <Label htmlFor="new-pain-high" className="text-sm">High</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="text-right">
          <Button 
            onClick={handleAddPain}
            disabled={!newPainContent.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Pain
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPains;
