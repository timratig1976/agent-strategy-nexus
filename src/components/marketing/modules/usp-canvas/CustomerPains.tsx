
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CustomerPain } from './types';
import { Trash2, Plus, GripVertical, CheckSquare, Square, User, Bot } from "lucide-react";

interface CustomerPainsProps {
  pains: CustomerPain[];
  onAdd: (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, severity: 'low' | 'medium' | 'high') => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedPains: CustomerPain[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerPains = ({ pains, onAdd, onUpdate, onDelete, onReorder, formPosition = 'bottom' }: CustomerPainsProps) => {
  const [newPainContent, setNewPainContent] = useState('');
  const [newPainSeverity, setNewPainSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedPains, setSelectedPains] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<null | string>(null);

  const handleAddPain = () => {
    if (newPainContent.trim()) {
      onAdd(newPainContent.trim(), newPainSeverity, false);
      setNewPainContent('');
      setNewPainSeverity('medium');
    }
  };

  const toggleSelectPain = (painId: string) => {
    if (selectedPains.includes(painId)) {
      setSelectedPains(selectedPains.filter(id => id !== painId));
    } else {
      setSelectedPains([...selectedPains, painId]);
    }
  };

  const handleDeleteSelected = () => {
    selectedPains.forEach(id => onDelete(id));
    setSelectedPains([]);
    setIsSelectMode(false);
  };

  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedPains([]);
  };

  const handleDragStart = (e: React.DragEvent, painId: string) => {
    setDraggedItem(painId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem !== null && draggedItem !== targetId && onReorder) {
      const currentPains = [...pains];
      const draggedIndex = currentPains.findIndex(pain => pain.id === draggedItem);
      const targetIndex = currentPains.findIndex(pain => pain.id === targetId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = currentPains.splice(draggedIndex, 1);
        currentPains.splice(targetIndex, 0, removed);
        onReorder(currentPains);
      }
    }
    
    setDraggedItem(null);
  };

  // Form to add new pains
  const AddPainForm = () => (
    <div className="p-4 border rounded-md space-y-4 mb-4">
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
  );

  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-red-800 mb-2">What are Customer Pains?</h3>
        <p className="text-sm text-red-700">
          Customer pains describe anything that annoys your customers before, during, and after trying to get a job done. 
          This includes undesired outcomes, problems, and obstacles that prevent customers from getting a job done.
        </p>
      </div>

      {formPosition === 'top' && <AddPainForm />}

      {pains.length > 0 && (
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

      {isSelectMode && selectedPains.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-slate-100 rounded-md">
          <span className="text-sm">{selectedPains.length} pains selected</span>
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
        {pains.map((pain) => (
          <div 
            key={pain.id} 
            className={`p-3 bg-white border rounded-md ${
              isSelectMode && selectedPains.includes(pain.id) ? 'border-primary bg-primary/5' : ''
            } ${draggedItem === pain.id ? 'opacity-50' : 'opacity-100'}`}
            draggable={onReorder !== undefined}
            onDragStart={(e) => handleDragStart(e, pain.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, pain.id)}
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
                  onClick={() => toggleSelectPain(pain.id)}
                >
                  {selectedPains.includes(pain.id) ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </Button>
              ) : null}
              
              <Badge 
                variant={pain.severity === 'high' ? 'destructive' : 
                        pain.severity === 'medium' ? 'warning' : 'success'}
                className="w-16 flex justify-center"
              >
                {pain.severity.charAt(0).toUpperCase() + pain.severity.slice(1)}
              </Badge>
              
              <div className="flex-1">
                <Input 
                  value={pain.content}
                  onChange={(e) => onUpdate(pain.id, e.target.value, pain.severity)}
                  placeholder="What frustrates or annoys your customer?"
                />
              </div>
              
              {pain.isAIGenerated ? (
                <Bot className="h-5 w-5 text-blue-500 mr-1" />
              ) : (
                <User className="h-5 w-5 text-gray-500 mr-1" />
              )}
              
              {!isSelectMode && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(pain.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {formPosition === 'bottom' && <AddPainForm />}
    </div>
  );
};

export default CustomerPains;
