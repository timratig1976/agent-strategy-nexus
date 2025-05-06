
import { z } from "zod";

export const strategyFormSchema = z.object({
  name: z.string().min(3, { message: "Strategy name must be at least 3 characters" }),
  description: z.string().optional(),
  companyName: z.string().min(2, { message: "Company name is required" }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  productDescription: z.string().optional(),
  productUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  additionalInfo: z.string().optional()
});

export type StrategyFormValues = z.infer<typeof strategyFormSchema>;
