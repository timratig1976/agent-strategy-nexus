
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CustomerPain, PainReliever } from './types';
import { Trash2, Plus } from "lucide-react";

interface PainRelieversProps {
  relievers: PainReliever[];
  pains: CustomerPain[];
  onAdd: (content: string, relatedPainIds: string[]) => void;
  onUpdate: (id: string, content: string, relatedPainIds: string[]) => void;
  onDelete: (id: string) => void;
  formPosition?: 'top' | 'bottom';
}

const PainRelievers = ({ relievers, pains, onAdd, onUpdate, onDelete, formPosition = 'bottom' }: PainRelieversProps) => {
  const [newRelieverContent, setNewRelieverContent] = useState('');
  const [newRelieverPainIds, setNewRelieverPainIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [activeEditId, setActiveEditId] = useState<string | null>(null);

  // Initialize edit values when relievers change
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    relievers.forEach(reliever => {
      initialValues[reliever.id] = reliever.content;
    });
    setEditValues(initialValues);
  }, [relievers.map(r => r.id).join(',')]);

  const handleInputChange = (relieverId: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [relieverId]: value
    }));
  };

  const handleInputBlur = (relieverId: string) => {
    const reliever = relievers.find(r => r.id === relieverId);
    if (reliever && editValues[relieverId] !== reliever.content) {
      onUpdate(relieverId, editValues[relieverId], reliever.relatedPainIds);
    }
    setActiveEditId(null);
  };

  const handleAddReliever = () => {
    if (newRelieverContent.trim()) {
      onAdd(newRelieverContent.trim(), newRelieverPainIds);
      setNewRelieverContent('');
      setNewRelieverPainIds([]);
      
      // Focus back on the input after adding
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const togglePainSelection = (painId: string, relieverId?: string) => {
    if (relieverId) {
      // Update existing reliever
      const reliever = relievers.find(r => r.id === relieverId);
      if (reliever) {
        const updatedPainIds = reliever.relatedPainIds.includes(painId)
          ? reliever.relatedPainIds.filter(id => id !== painId)
          : [...reliever.relatedPainIds, painId];
        
        onUpdate(relieverId, editValues[relieverId] || reliever.content, updatedPainIds);
      }
    } else {
      // Update new reliever form
      setNewRelieverPainIds(prev => 
        prev.includes(painId)
          ? prev.filter(id => id !== painId)
          : [...prev, painId]
      );
    }
  };

  // Form to add new relievers
  const AddRelieverForm = () => (
    <div className="p-4 border rounded-md space-y-4 mb-4">
      <div className="flex-1">
        <Input 
          ref={inputRef}
          value={newRelieverContent}
          onChange={(e) => setNewRelieverContent(e.target.value)}
          placeholder="Add a new pain reliever..."
          className="w-full"
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-2 block">Related Customer Pains:</Label>
        <div className="space-y-2 flex flex-col items-center">
          {pains.length > 0 ? (
            pains.map((pain) => (
              <div key={pain.id} className="flex items-center space-x-2 w-full">
                <Checkbox 
                  id={`new-reliever-pain-${pain.id}`} 
                  checked={newRelieverPainIds.includes(pain.id)}
                  onCheckedChange={() => togglePainSelection(pain.id)}
                />
                <Label 
                  htmlFor={`new-reliever-pain-${pain.id}`}
                  className="text-sm flex-1"
                >
                  {pain.content}
                  {pain.severity === 'high' && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">
                      High Severity
                    </span>
                  )}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center w-full">No customer pains available</p>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={handleAddReliever}
          disabled={!newRelieverContent.trim()}
          className="mx-auto"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Pain Reliever
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-red-800 mb-2">What are Pain Relievers?</h3>
        <p className="text-sm text-red-700">
          Describe how your products and services alleviate specific customer pains.
          These are the features that eliminate or reduce negative emotions, costs, and situations that customers experience.
        </p>
      </div>

      {formPosition === 'top' && <AddRelieverForm />}

      {pains.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            First, add some customer pains in the Customer Profile tab to connect them to your pain relievers.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {relievers.map((reliever) => (
            <div key={reliever.id} className="p-4 bg-white border rounded-md">
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex-1">
                  <Input 
                    value={editValues[reliever.id] !== undefined ? editValues[reliever.id] : reliever.content}
                    onChange={(e) => handleInputChange(reliever.id, e.target.value)}
                    onFocus={() => setActiveEditId(reliever.id)}
                    onBlur={() => handleInputBlur(reliever.id)}
                    placeholder="How do you relieve customer pains?"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(reliever.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3">
                <Label className="text-sm font-medium mb-2 block">Related Customer Pains:</Label>
                <div className="space-y-2 flex flex-col items-center">
                  {pains.map((pain) => (
                    <div key={pain.id} className="flex items-center space-x-2 w-full">
                      <Checkbox 
                        id={`reliever-${reliever.id}-pain-${pain.id}`} 
                        checked={reliever.relatedPainIds.includes(pain.id)}
                        onCheckedChange={() => togglePainSelection(pain.id, reliever.id)}
                      />
                      <Label 
                        htmlFor={`reliever-${reliever.id}-pain-${pain.id}`}
                        className="text-sm flex-1"
                      >
                        {pain.content}
                        {pain.severity === 'high' && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">
                            High Severity
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formPosition === 'bottom' && pains.length > 0 && <AddRelieverForm />}
    </div>
  );
};

export default PainRelievers;
