
import * as React from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  options: { label: string; value: string }[];
  values: string[];
  onChange: (value: string, checked: CheckedState) => void;
  label?: string;
}

export const CheckboxGroup = ({
  options,
  values,
  onChange,
  label
}: CheckboxGroupProps) => {
  return (
    <div className="space-y-3">
      {label && <Label className="mb-2 block">{label}</Label>}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={values.includes(option.value)}
              onCheckedChange={(checked) => onChange(option.value, checked)}
            />
            <Label
              htmlFor={option.value}
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
