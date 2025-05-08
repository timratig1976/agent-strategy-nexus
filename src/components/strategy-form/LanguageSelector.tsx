
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { GlobeIcon } from "lucide-react";
import { StrategyFormValues } from "./strategyFormSchema";

interface LanguageSelectorProps {
  form: UseFormReturn<StrategyFormValues>;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Language</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="h-4 w-4" />
                  <SelectValue placeholder="Select Language" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="deutsch">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LanguageSelector;
