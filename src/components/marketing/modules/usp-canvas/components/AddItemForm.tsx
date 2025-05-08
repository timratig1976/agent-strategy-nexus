
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface AddItemFormProps {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  rating: 'low' | 'medium' | 'high';
  onRatingChange: (value: 'low' | 'medium' | 'high') => void;
  inputRef: React.RefObject<HTMLInputElement>;
  placeholder: string;
  ratingLabel: string;
}

const AddItemForm = ({
  value,
  onChange,
  onAdd,
  rating,
  onRatingChange,
  inputRef,
  placeholder,
  ratingLabel
}: AddItemFormProps) => {
  return (
    <div className="p-4 border rounded-md space-y-4 mb-4">
      <div className="flex flex-wrap items-center gap-2 justify-center">
        <div className="flex-1 min-w-[200px]">
          <Input 
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.trim()) {
                onAdd();
                e.preventDefault();
              }
            }}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <RadioGroup 
            value={rating} 
            onValueChange={(value) => onRatingChange(value as 'low' | 'medium' | 'high')}
            className="flex space-x-2"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="low" id={`new-${ratingLabel}-low`} />
              <Label htmlFor={`new-${ratingLabel}-low`} className="text-xs">Low</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="medium" id={`new-${ratingLabel}-medium`} />
              <Label htmlFor={`new-${ratingLabel}-medium`} className="text-xs">Medium</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="high" id={`new-${ratingLabel}-high`} />
              <Label htmlFor={`new-${ratingLabel}-high`} className="text-xs">High</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={onAdd}
          disabled={!value.trim()}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
    </div>
  );
};

export default AddItemForm;
