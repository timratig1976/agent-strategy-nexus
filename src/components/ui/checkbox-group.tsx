
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupOption {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  label: string;
  options: CheckboxGroupOption[];
  values: string[];
  onChange: (value: string, checked: boolean) => void;
}

export const CheckboxGroup = ({ label, options, values, onChange }: CheckboxGroupProps) => {
  return (
    <div className="space-y-3">
      <Label className="block">{label}</Label>
      <div className="grid gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`checkbox-${option.value}`}
              checked={values.includes(option.value)}
              onCheckedChange={(checked) => onChange(option.value, !!checked)}
            />
            <Label
              htmlFor={`checkbox-${option.value}`}
              className="text-sm cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
