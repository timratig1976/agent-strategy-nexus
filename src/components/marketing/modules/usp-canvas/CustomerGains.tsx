
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CustomerGain } from './types';
import { Trash2, Plus } from "lucide-react";

interface CustomerGainsProps {
  gains: CustomerGain[];
  onAdd: (content: string, importance: 'low' | 'medium' | 'high') => void;
  onUpdate: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
}

const CustomerGains = ({ gains, onAdd, onUpdate, onDelete }: CustomerGainsProps) => {
  const [newGainContent, setNewGainContent] = useState('');
  const [newGainImportance, setNewGainImportance] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddGain = () => {
    if (newGainContent.trim()) {
      onAdd(newGainContent.trim(), newGainImportance);
      setNewGainContent('');
      setNewGainImportance('medium');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-green-800 mb-2">What are Customer Gains?</h3>
        <p className="text-sm text-green-700">
          Gains describe the outcomes and benefits your customers want. These can include functional 
          utility, social gains, positive emotions, and cost savings that customers seek.
        </p>
      </div>

      <div className="space-y-4">
        {gains.map((gain) => (
          <div key={gain.id} className="flex items-start space-x-3 p-3 bg-white border rounded-md">
            <div className="flex-1">
              <Input 
                value={gain.content}
                onChange={(e) => onUpdate(gain.id, e.target.value, gain.importance)}
                placeholder="What gains do your customers want to achieve?"
                className="mb-2"
              />
              <RadioGroup 
                value={gain.importance} 
                onValueChange={(value) => onUpdate(gain.id, gain.content, value as 'low' | 'medium' | 'high')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="low" id={`gain-${gain.id}-low`} />
                  <Label htmlFor={`gain-${gain.id}-low`} className="text-xs">Low Importance</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="medium" id={`gain-${gain.id}-medium`} />
                  <Label htmlFor={`gain-${gain.id}-medium`} className="text-xs">Medium Importance</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="high" id={`gain-${gain.id}-high`} />
                  <Label htmlFor={`gain-${gain.id}-high`} className="text-xs">High Importance</Label>
                </div>
              </RadioGroup>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(gain.id)}
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
            value={newGainContent}
            onChange={(e) => setNewGainContent(e.target.value)}
            placeholder="Add a new customer gain..."
          />
          <RadioGroup 
            value={newGainImportance} 
            onValueChange={(value) => setNewGainImportance(value as 'low' | 'medium' | 'high')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="low" id="new-gain-low" />
              <Label htmlFor="new-gain-low" className="text-xs">Low Importance</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="medium" id="new-gain-medium" />
              <Label htmlFor="new-gain-medium" className="text-xs">Medium Importance</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="high" id="new-gain-high" />
              <Label htmlFor="new-gain-high" className="text-xs">High Importance</Label>
            </div>
          </RadioGroup>
        </div>
        <Button 
          onClick={handleAddGain}
          disabled={!newGainContent.trim()}
          className="mb-1"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Gain
        </Button>
      </div>
    </div>
  );
};

export default CustomerGains;
