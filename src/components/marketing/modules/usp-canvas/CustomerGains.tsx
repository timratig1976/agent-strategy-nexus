
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
          Customer gains describe the outcomes and benefits your customers want. 
          Some are required, expected, or desired, and some would surprise them. 
          These include functional utility, social gains, positive emotions, and cost savings.
        </p>
      </div>

      <div className="space-y-4">
        {gains.map((gain) => (
          <div key={gain.id} className="p-4 bg-white border rounded-md">
            <div className="flex items-start space-x-3 mb-3">
              <div className="flex-1">
                <Input 
                  value={gain.content}
                  onChange={(e) => onUpdate(gain.id, e.target.value, gain.importance)}
                  placeholder="What benefits does your customer desire?"
                />
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
            
            <div className="mt-3">
              <Label className="text-sm font-medium mb-2">Gain Importance:</Label>
              <RadioGroup 
                value={gain.importance} 
                onValueChange={(value) => onUpdate(gain.id, gain.content, value as 'low' | 'medium' | 'high')}
                className="flex space-x-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id={`gain-${gain.id}-low`} />
                  <Label htmlFor={`gain-${gain.id}-low`} className="text-sm">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id={`gain-${gain.id}-medium`} />
                  <Label htmlFor={`gain-${gain.id}-medium`} className="text-sm">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id={`gain-${gain.id}-high`} />
                  <Label htmlFor={`gain-${gain.id}-high`} className="text-sm">High</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border rounded-md space-y-4">
        <div>
          <Input 
            value={newGainContent}
            onChange={(e) => setNewGainContent(e.target.value)}
            placeholder="Add a new customer gain..."
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2">Gain Importance:</Label>
          <RadioGroup 
            value={newGainImportance} 
            onValueChange={(value) => setNewGainImportance(value as 'low' | 'medium' | 'high')}
            className="flex space-x-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="new-gain-low" />
              <Label htmlFor="new-gain-low" className="text-sm">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="new-gain-medium" />
              <Label htmlFor="new-gain-medium" className="text-sm">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="new-gain-high" />
              <Label htmlFor="new-gain-high" className="text-sm">High</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="text-right">
          <Button 
            onClick={handleAddGain}
            disabled={!newGainContent.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Gain
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerGains;
