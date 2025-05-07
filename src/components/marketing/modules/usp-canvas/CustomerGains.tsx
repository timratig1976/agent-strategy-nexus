
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CustomerGain } from './types';
import { Trash2, Plus, GripVertical, CheckSquare, Square } from "lucide-react";

interface CustomerGainsProps {
  gains: CustomerGain[];
  onAdd: (content: string, importance: 'low' | 'medium' | 'high') => void;
  onUpdate: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedGains: CustomerGain[]) => void;
}

const CustomerGains = ({ gains, onAdd, onUpdate, onDelete, onReorder }: CustomerGainsProps) => {
  const [newGainContent, setNewGainContent] = useState('');
  const [newGainImportance, setNewGainImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedGains, setSelectedGains] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<null | string>(null);

  const handleAddGain = () => {
    if (newGainContent.trim()) {
      onAdd(newGainContent.trim(), newGainImportance);
      setNewGainContent('');
      setNewGainImportance('medium');
    }
  };

  const toggleSelectGain = (gainId: string) => {
    if (selectedGains.includes(gainId)) {
      setSelectedGains(selectedGains.filter(id => id !== gainId));
    } else {
      setSelectedGains([...selectedGains, gainId]);
    }
  };

  const handleDeleteSelected = () => {
    selectedGains.forEach(id => onDelete(id));
    setSelectedGains([]);
    setIsSelectMode(false);
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedGains([]);
  };

  const handleDragStart = (e: React.DragEvent, gainId: string) => {
    setDraggedItem(gainId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem !== null && draggedItem !== targetId && onReorder) {
      const currentGains = [...gains];
      const draggedIndex = currentGains.findIndex(gain => gain.id === draggedItem);
      const targetIndex = currentGains.findIndex(gain => gain.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = currentGains.splice(draggedIndex, 1);
        currentGains.splice(targetIndex, 0, removed);
        onReorder(currentGains);
      }
    }
    
    setDraggedItem(null);
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

      {gains.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1 text-sm invisible">
            <span>Placeholder</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSelectMode}
            className="text-sm"
          >
            {isSelectMode ? (
              <>Cancel Selection</>
            ) : (
              <>Select Multiple</>
            )}
          </Button>
        </div>
      )}

      {isSelectMode && selectedGains.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
          <span className="text-sm">{selectedGains.length} gains selected</span>
          <Button 
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {gains.map((gain) => (
          <div 
            key={gain.id} 
            className={`p-3 bg-white border rounded-md ${
              isSelectMode && selectedGains.includes(gain.id) ? 'border-primary bg-primary/5' : ''
            } ${draggedItem === gain.id ? 'opacity-50' : 'opacity-100'}`}
            draggable={onReorder !== undefined}
            onDragStart={(e) => handleDragStart(e, gain.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, gain.id)}
          >
            <div className="flex items-center space-x-2">
              {onReorder && (
                <div className="cursor-grab">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                </div>
              )}
              
              {isSelectMode ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-6 w-6"
                  onClick={() => toggleSelectGain(gain.id)}
                >
                  {selectedGains.includes(gain.id) ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </Button>
              ) : null}
              
              <Badge 
                variant={gain.importance === 'high' ? 'destructive' : 
                        gain.importance === 'medium' ? 'warning' : 'success'}
                className="w-16 flex justify-center"
              >
                {gain.importance.charAt(0).toUpperCase() + gain.importance.slice(1)}
              </Badge>
              
              <div className="flex-1">
                <Input 
                  value={gain.content}
                  onChange={(e) => onUpdate(gain.id, e.target.value, gain.importance)}
                  placeholder="What benefits does your customer desire?"
                />
              </div>
              
              {gain.isAIGenerated && (
                <Badge variant="secondary" className="mr-2">AI</Badge>
              )}
              
              {!isSelectMode && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(gain.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
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
