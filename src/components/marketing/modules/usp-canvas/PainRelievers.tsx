
import React, { useState } from 'react';
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

  const handleAddReliever = () => {
    if (newRelieverContent.trim()) {
      onAdd(newRelieverContent.trim(), newRelieverPainIds);
      setNewRelieverContent('');
      setNewRelieverPainIds([]);
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
        
        onUpdate(relieverId, reliever.content, updatedPainIds);
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

  // Form to add new pain relievers
  const AddRelieverForm = () => (
    <div className="p-4 border rounded-md space-y-4 mb-4">
      <div className="flex-1">
        <Input 
          value={newRelieverContent}
          onChange={(e) => setNewRelieverContent(e.target.value)}
          placeholder="Add a new pain reliever..."
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-2 block">Related Customer Pains:</Label>
        <div className="space-y-2 ml-2">
          {pains.map((pain) => (
            <div key={pain.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`new-reliever-pain-${pain.id}`} 
                checked={newRelieverPainIds.includes(pain.id)}
                onCheckedChange={() => togglePainSelection(pain.id)}
              />
              <Label 
                htmlFor={`new-reliever-pain-${pain.id}`}
                className="text-sm"
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
      
      <div className="text-right">
        <Button 
          onClick={handleAddReliever}
          disabled={!newRelieverContent.trim()}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Pain Reliever
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-base font-medium text-orange-800 mb-2">What are Pain Relievers?</h3>
        <p className="text-sm text-orange-700">
          Pain relievers describe how your products and services alleviate specific customer pains. 
          They explicitly outline how you intend to reduce or eliminate the things that annoy your customers.
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
                    value={reliever.content}
                    onChange={(e) => onUpdate(reliever.id, e.target.value, reliever.relatedPainIds)}
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
                <div className="space-y-2 ml-2">
                  {pains.map((pain) => (
                    <div key={pain.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`reliever-${reliever.id}-pain-${pain.id}`} 
                        checked={reliever.relatedPainIds.includes(pain.id)}
                        onCheckedChange={() => togglePainSelection(pain.id, reliever.id)}
                      />
                      <Label 
                        htmlFor={`reliever-${reliever.id}-pain-${pain.id}`}
                        className="text-sm"
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
