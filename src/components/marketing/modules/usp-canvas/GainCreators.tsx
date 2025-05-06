
import React, { useState } from 'react';
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
}

const GainCreators = ({ creators, gains, onAdd, onUpdate, onDelete }: GainCreatorsProps) => {
  const [newCreatorContent, setNewCreatorContent] = useState('');
  const [newCreatorGainIds, setNewCreatorGainIds] = useState<string[]>([]);

  const handleAddCreator = () => {
    if (newCreatorContent.trim()) {
      onAdd(newCreatorContent.trim(), newCreatorGainIds);
      setNewCreatorContent('');
      setNewCreatorGainIds([]);
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
        
        onUpdate(creatorId, creator.content, updatedGainIds);
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

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-emerald-800 mb-2">What are Gain Creators?</h3>
        <p className="text-sm text-emerald-700">
          Describe how your products and services create customer gains. 
          These should clearly produce outcomes and benefits that your customer expects, desires, or would be surprised by.
        </p>
      </div>

      {gains.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">
            First, add some customer gains in the Customer Profile tab to connect them to your gain creators.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {creators.map((creator) => (
              <div key={creator.id} className="p-4 bg-white border rounded-md">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="flex-1">
                    <Input 
                      value={creator.content}
                      onChange={(e) => onUpdate(creator.id, e.target.value, creator.relatedGainIds)}
                      placeholder="How does your product create customer gains?"
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
                  <div className="space-y-2 ml-2">
                    {gains.map((gain) => (
                      <div key={gain.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`creator-${creator.id}-gain-${gain.id}`} 
                          checked={creator.relatedGainIds.includes(gain.id)}
                          onCheckedChange={() => toggleGainSelection(gain.id, creator.id)}
                        />
                        <Label 
                          htmlFor={`creator-${creator.id}-gain-${gain.id}`}
                          className="text-sm"
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

          <div className="p-4 border rounded-md space-y-4">
            <div className="flex-1">
              <Input 
                value={newCreatorContent}
                onChange={(e) => setNewCreatorContent(e.target.value)}
                placeholder="Add a new gain creator..."
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Related Customer Gains:</Label>
              <div className="space-y-2 ml-2">
                {gains.map((gain) => (
                  <div key={gain.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`new-creator-gain-${gain.id}`} 
                      checked={newCreatorGainIds.includes(gain.id)}
                      onCheckedChange={() => toggleGainSelection(gain.id)}
                    />
                    <Label 
                      htmlFor={`new-creator-gain-${gain.id}`}
                      className="text-sm"
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
            
            <div className="text-right">
              <Button 
                onClick={handleAddCreator}
                disabled={!newCreatorContent.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Gain Creator
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GainCreators;
