
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { strategyFormSchema } from "./strategyFormSchema";

type StrategyFormValues = z.infer<typeof strategyFormSchema>;

interface AdditionalInfoSectionProps {
  form: UseFormReturn<StrategyFormValues>;
}

const AdditionalInfoSection = ({ form }: AdditionalInfoSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="additionalInfo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Additional Information</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Any other relevant information about your strategy, target audience, goals, etc."
              rows={4}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AdditionalInfoSection;
