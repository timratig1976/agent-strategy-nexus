
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomerGain } from './types';
import { Trash2, Plus, GripVertical, CheckSquare, Square, User, Bot, HelpCircle, Filter } from "lucide-react";

interface CustomerGainsProps {
  gains: CustomerGain[];
  onAdd: (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedGains: CustomerGain[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerGains = ({ gains, onAdd, onUpdate, onDelete, onReorder, formPosition = 'bottom' }: CustomerGainsProps) => {
  const [newGainContent, setNewGainContent] = useState('');
  const [newGainImportance, setNewGainImportance] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedGains, setSelectedGains] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<null | string>(null);
  const [aiOnlyFilter, setAiOnlyFilter] = useState<boolean>(false);
  const newGainInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Maintain focus on the input field
    if (formPosition === 'top' && newGainInputRef.current) {
      newGainInputRef.current.focus();
    }
  }, [formPosition]);

  const handleAddGain = () => {
    if (newGainContent.trim()) {
      onAdd(newGainContent.trim(), newGainImportance, false);
      setNewGainContent('');
      // Maintain focus on the input
      setTimeout(() => {
        if (newGainInputRef.current) {
          newGainInputRef.current.focus();
        }
      }, 0);
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

  const handleDeleteAIGenerated = () => {
    const aiGeneratedGains = gains.filter(gain => gain.isAIGenerated).map(gain => gain.id);
    aiGeneratedGains.forEach(id => onDelete(id));
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
      const currentGains = [...filteredGains];
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

  // Filter AI-generated gains if needed
  const filteredGains = aiOnlyFilter ? gains.filter(gain => gain.isAIGenerated) : gains;
  const aiGeneratedCount = gains.filter(gain => gain.isAIGenerated).length;

  // Compact form to add new gains
  const AddGainForm = () => (
    <div className="p-4 border rounded-md space-y-4 mb-4">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[200px]">
          <Input 
            ref={newGainInputRef}
            value={newGainContent}
            onChange={(e) => setNewGainContent(e.target.value)}
            placeholder="Add a new customer gain..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newGainContent.trim()) {
                handleAddGain();
                e.preventDefault();
              }
            }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroup 
            value={newGainImportance} 
            onValueChange={(value) => setNewGainImportance(value as 'low' | 'medium' | 'high')}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="low" id="new-gain-low" />
              <Label htmlFor="new-gain-low" className="text-xs">Low</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="medium" id="new-gain-medium" />
              <Label htmlFor="new-gain-medium" className="text-xs">Medium</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="high" id="new-gain-high" />
              <Label htmlFor="new-gain-high" className="text-xs">High</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleAddGain}
          disabled={!newGainContent.trim()}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Customer Gains</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <div className="space-y-2">
                <p className="font-medium">What are Customer Gains?</p>
                <p className="text-sm">
                  Customer gains describe the outcomes and benefits your customers want. 
                  Some are required, expected, or desired, and some would surprise them. 
                  These include functional utility, social gains, positive emotions, and cost savings.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {formPosition === 'top' && <AddGainForm />}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAiOnlyFilter(!aiOnlyFilter)}
            className={`flex items-center gap-1 text-xs ${aiOnlyFilter ? 'bg-primary/10' : ''}`}
          >
            <Filter className="h-3 w-3" />
            AI Only
          </Button>
          
          {aiGeneratedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteAIGenerated}
              className="flex items-center gap-1 text-xs text-red-500"
            >
              <Trash2 className="h-3 w-3" />
              Clear AI ({aiGeneratedCount})
            </Button>
          )}
        </div>
        
        {gains.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSelectMode}
            className="text-xs"
          >
            {isSelectMode ? 'Cancel' : 'Select'}
          </Button>
        )}
      </div>

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

      {filteredGains.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            {aiOnlyFilter 
              ? "No AI-generated gains found. Generate some using the AI Generator tab." 
              : "No gains added yet. Add your first customer gain above."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredGains.map((gain) => (
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
                
                {gain.isAIGenerated ? (
                  <Bot className="h-5 w-5 text-blue-500 mr-1" />
                ) : (
                  <User className="h-5 w-5 text-gray-500 mr-1" />
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
      )}

      {formPosition === 'bottom' && <AddGainForm />}
    </div>
  );
};

export default CustomerGains;
