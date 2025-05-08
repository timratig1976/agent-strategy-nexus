
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { RelatedCustomerItem } from './types';

interface RelatedItemCardProps {
  itemId: string;
  content: string;
  relatedItemIds: string[];
  customerItems: RelatedCustomerItem[];
  customerItemType: string;
  customerItemRatingType: 'priority' | 'severity' | 'importance';
  customerItemRatingLabel: string;
  editValues: Record<string, string>;
  activeEditId: string | null;
  handleInputChange: (itemId: string, value: string) => void;
  setActiveEditId: (id: string | null) => void;
  handleInputBlur: (itemId: string) => void;
  toggleItemSelection: (customerItemId: string, itemId: string) => void;
  onDelete: (id: string) => void;
  getRating: (item: RelatedCustomerItem) => 'low' | 'medium' | 'high' | undefined;
  itemPlaceholder: string;
}

const RelatedItemCard = ({
  itemId,
  content,
  relatedItemIds,
  customerItems,
  customerItemType,
  customerItemRatingType,
  customerItemRatingLabel,
  editValues,
  activeEditId,
  handleInputChange,
  setActiveEditId,
  handleInputBlur,
  toggleItemSelection,
  onDelete,
  getRating,
  itemPlaceholder
}: RelatedItemCardProps) => {
  return (
    <div className="p-4 bg-white border rounded-md">
      <div className="flex items-start space-x-3 mb-3">
        <div className="flex-1">
          <Input 
            value={editValues[itemId] !== undefined ? editValues[itemId] : content}
            onChange={(e) => handleInputChange(itemId, e.target.value)}
            onFocus={() => setActiveEditId(itemId)}
            onBlur={() => handleInputBlur(itemId)}
            placeholder={itemPlaceholder}
          />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(itemId)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mt-3">
        <Label className="text-sm font-medium mb-2 block">Related Customer {customerItemType}s:</Label>
        <div className="space-y-2 flex flex-col items-center">
          {customerItems.map((customerItem) => (
            <div key={customerItem.id} className="flex items-center space-x-2 w-full">
              <Checkbox 
                id={`item-${itemId}-${customerItem.id}`} 
                checked={relatedItemIds.includes(customerItem.id)}
                onCheckedChange={() => toggleItemSelection(customerItem.id, itemId)}
              />
              <Label 
                htmlFor={`item-${itemId}-${customerItem.id}`}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedItemCard;
