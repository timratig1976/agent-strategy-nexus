
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CustomerGain, GainCreator } from './types';
import { Trash2, Plus } from "lucide-react";

interface GainCreatorsProps {
  creators: GainCreator[];
  gains: CustomerGain[];
  onAdd: (content: string, relatedGainIds: string[]) => void;
  onUpdate: (id: string, content: string, relatedGainIds: string[]) => void;
  onDelete: (id: string) => void;
  formPosition?: 'top' | 'bottom';
}

const GainCreators = ({ creators, gains, onAdd, onUpdate, onDelete, formPosition = 'bottom' }: GainCreatorsProps) => {
  const [newCreatorContent, setNewCreatorContent] = useState('');
  const [newCreatorGainIds, setNewCreatorGainIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [activeEditId, setActiveEditId] = useState<string | null>(null);

  // Initialize edit values when creators change
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    creators.forEach(creator => {
      initialValues[creator.id] = creator.content;
    });
    setEditValues(initialValues);
  }, [creators.map(c => c.id).join(',')]);

  const handleInputChange = (creatorId: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [creatorId]: value
    }));
  };

  const handleInputBlur = (creatorId: string) => {
    const creator = creators.find(c => c.id === creatorId);
    if (creator && editValues[creatorId] !== creator.content) {
      onUpdate(creatorId, editValues[creatorId], creator.relatedGainIds);
    }
    setActiveEditId(null);
  };

  const handleAddCreator = () => {
    if (newCreatorContent.trim()) {
      onAdd(newCreatorContent.trim(), newCreatorGainIds);
      setNewCreatorContent('');
      setNewCreatorGainIds([]);
      
      // Focus back on the input after adding
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const toggleGainSelection = (gainId: string, creatorId?: string) => {
    if (creatorId) {
      // Update existing creator
      const creator = creators.find(c => c.id === creatorId);
      if (creator) {
        const updatedGainIds = creator.relatedGainIds.includes(gainId)
          ? creator.relatedGainIds.filter(id => id !== gainId)
          : [...creator.relatedGainIds, gainId];
        
        onUpdate(creatorId, editValues[creatorId] || creator.content, updatedGainIds);
      }
    } else {
      // Update new creator form
      setNewCreatorGainIds(prev => 
        prev.includes(gainId)
          ? prev.filter(id => id !== gainId)
          : [...prev, gainId]
      );
    }
  };

  // Form to add new creators
  const AddCreatorForm = () => (
    <div className="p-4 border rounded-md space-y-4 mb-4">
      <div className="flex-1">
        <Input 
          ref={inputRef}
          value={newCreatorContent}
          onChange={(e) => setNewCreatorContent(e.target.value)}
          placeholder="Add a new gain creator..."
          className="w-full"
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-2 block">Related Customer Gains:</Label>
        <div className="space-y-2 flex flex-col items-center">
          {gains.length > 0 ? (
            gains.map((gain) => (
              <div key={gain.id} className="flex items-center space-x-2 w-full">
                <Checkbox 
                  id={`new-creator-gain-${gain.id}`} 
                  checked={newCreatorGainIds.includes(gain.id)}
                  onCheckedChange={() => toggleGainSelection(gain.id)}
                />
                <Label 
                  htmlFor={`new-creator-gain-${gain.id}`}
                  className="text-sm flex-1"
                >
                  {gain.content}
                  {gain.importance === 'high' && (
                    <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                      High Importance
                    </span>
                  )}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center w-full">No customer gains available</p>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={handleAddCreator}
          disabled={!newCreatorContent.trim()}
          className="mx-auto"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Gain Creator
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-green-800 mb-2">What are Gain Creators?</h3>
        <p className="text-sm text-green-700">
          Describe how your products and services create customer gains.
          These are the features that produce outcomes and benefits that your customer expects, desires, or would be surprised by.
        </p>
      </div>

      {formPosition === 'top' && <AddCreatorForm />}

      {gains.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            First, add some customer gains in the Customer Profile tab to connect them to your gain creators.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {creators.map((creator) => (
            <div key={creator.id} className="p-4 bg-white border rounded-md">
              <div className="flex items-start space-x-3 mb-3">
                <div className="flex-1">
                  <Input 
                    value={editValues[creator.id] !== undefined ? editValues[creator.id] : creator.content}
                    onChange={(e) => handleInputChange(creator.id, e.target.value)}
                    onFocus={() => setActiveEditId(creator.id)}
                    onBlur={() => handleInputBlur(creator.id)}
                    placeholder="How do you create customer gains?"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(creator.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-3">
                <Label className="text-sm font-medium mb-2 block">Related Customer Gains:</Label>
                <div className="space-y-2 flex flex-col items-center">
                  {gains.map((gain) => (
                    <div key={gain.id} className="flex items-center space-x-2 w-full">
                      <Checkbox 
                        id={`creator-${creator.id}-gain-${gain.id}`} 
                        checked={creator.relatedGainIds.includes(gain.id)}
                        onCheckedChange={() => toggleGainSelection(gain.id, creator.id)}
                      />
                      <Label 
                        htmlFor={`creator-${creator.id}-gain-${gain.id}`}
                        className="text-sm flex-1"
                      >
                        {gain.content}
                        {gain.importance === 'high' && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                            High Importance
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

      {formPosition === 'bottom' && gains.length > 0 && <AddCreatorForm />}
    </div>
  );
};

export default GainCreators;
