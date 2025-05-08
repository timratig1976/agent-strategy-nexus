
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { strategyFormSchema } from "./strategyFormSchema";
import LanguageSelector from "./LanguageSelector";

type StrategyFormValues = z.infer<typeof strategyFormSchema>;

interface BasicInfoSectionProps {
  form: UseFormReturn<StrategyFormValues>;
}

const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Strategy Name *</FormLabel>
            <FormControl>
              <Input placeholder="E.g., Q3 Product Launch Strategy" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <LanguageSelector form={form} />
    </>
  );
};

export default BasicInfoSection;
