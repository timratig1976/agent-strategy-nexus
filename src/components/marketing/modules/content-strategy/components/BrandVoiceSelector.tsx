
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const BRAND_VOICE_OPTIONS = [
  "Professional", "Conversational", "Authoritative", "Educational", 
  "Entertaining", "Inspirational", "Technical", "Friendly"
];

interface BrandVoiceSelectorProps {
  selectedVoices: string[];
  onChange: (field: string, value: string, isChecked: boolean) => void;
}

const BrandVoiceSelector = ({ selectedVoices, onChange }: BrandVoiceSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Brand Voice</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {BRAND_VOICE_OPTIONS.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox 
              id={`voice-${option}`}
              checked={selectedVoices.includes(option)}
              onCheckedChange={(checked) => 
                onChange('brandVoice', option, checked === true)
              }
            />
            <Label htmlFor={`voice-${option}`} className="text-sm font-normal cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandVoiceSelector;
