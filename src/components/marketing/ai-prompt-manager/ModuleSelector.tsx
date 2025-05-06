
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModuleSelectorProps } from "./types";

export const ModuleSelector: React.FC<ModuleSelectorProps> = ({
  selectedModule,
  moduleOptions,
  isLoading,
  onModuleChange
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Module</label>
      <Select
        value={selectedModule}
        onValueChange={onModuleChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a module" />
        </SelectTrigger>
        <SelectContent>
          {moduleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModuleSelector;
