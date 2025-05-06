
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { strategyFormSchema } from "./strategyFormSchema";

type StrategyFormValues = z.infer<typeof strategyFormSchema>;

interface ProductSectionProps {
  form: UseFormReturn<StrategyFormValues>;
}

const ProductSection = ({ form }: ProductSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="productDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your product or service..."
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="productUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product URL</FormLabel>
            <FormControl>
              <Input placeholder="https://yourcompany.com/product" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ProductSection;
