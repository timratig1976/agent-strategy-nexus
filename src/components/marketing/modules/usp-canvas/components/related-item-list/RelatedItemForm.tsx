
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { RelatedCustomerItem } from './types';

interface RelatedItemFormProps {
  newItemContent: string;
  setNewItemContent: (content: string) => void;
  newItemRelatedIds: string[];
  toggleItemSelection: (customerItemId: string) => void;
  customerItems: RelatedCustomerItem[];
  customerItemType: string;
  customerItemRatingType: 'priority' | 'severity' | 'importance';
  customerItemRatingLabel: string;
  handleAddItem: () => void;
  getRating: (item: RelatedCustomerItem) => 'low' | 'medium' | 'high' | undefined;
}

const RelatedItemForm = ({
  newItemContent,
  setNewItemContent,
  newItemRelatedIds,
  toggleItemSelection,
  customerItems,
  customerItemType,
  customerItemRatingType,
  customerItemRatingLabel,
  handleAddItem,
  getRating
}: RelatedItemFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 border rounded-md space-y-4 mb-4">
      <div className="flex-1">
        <Input 
          ref={inputRef}
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          placeholder={`Add a new ${customerItemType}...`}
          className="w-full"
        />
      </div>
      
      <div>
        <Label className="text-sm font-medium mb-2 block">Related Customer {customerItemType}s:</Label>
        <div className="space-y-2 flex flex-col items-center">
          {customerItems.length > 0 ? (
            customerItems.map((customerItem) => (
              <div key={customerItem.id} className="flex items-center space-x-2 w-full">
                <Checkbox 
                  id={`new-item-${customerItem.id}`} 
                  checked={newItemRelatedIds.includes(customerItem.id)}
                  onCheckedChange={() => toggleItemSelection(customerItem.id)}
                />
                <Label 
                  htmlFor={`new-item-${customerItem.id}`}
                  className="text-sm flex-1"
                >
                  {customerItem.content}
                  {getRating(customerItem) === 'high' && (
                    <span className={`ml-2 text-xs px-1.5 py-0.5 bg-${customerItemRatingLabel === 'priority' ? 'blue' : customerItemRatingLabel === 'severity' ? 'red' : 'green'}-100 text-${customerItemRatingLabel === 'priority' ? 'blue' : customerItemRatingLabel === 'severity' ? 'red' : 'green'}-800 rounded-full`}>
                      High {customerItemRatingLabel.charAt(0).toUpperCase() + customerItemRatingLabel.slice(1)}
                    </span>
                  )}
                </Label>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center w-full">No customer {customerItemType}s available</p>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={handleAddItem}
          disabled={!newItemContent.trim()}
          className="mx-auto"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
};

export default RelatedItemForm;
