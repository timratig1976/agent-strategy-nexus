
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ChannelStrategyFormData } from "./types";
import { Loader2 } from "lucide-react";

const marketingChannels = [
  { id: "social_media", label: "Social Media" },
  { id: "search_ads", label: "Search Ads" },
  { id: "display_ads", label: "Display Ads" },
  { id: "email", label: "Email Marketing" },
  { id: "content", label: "Content Marketing" },
  { id: "seo", label: "SEO" },
  { id: "video", label: "Video Marketing" },
  { id: "influencer", label: "Influencer Marketing" },
  { id: "pr", label: "PR & Media" },
  { id: "events", label: "Events & Webinars" }
];

const goalOptions = [
  { id: "brand_awareness", label: "Brand Awareness" },
  { id: "lead_generation", label: "Lead Generation" },
  { id: "sales", label: "Sales & Revenue" },
  { id: "customer_retention", label: "Customer Retention" },
  { id: "engagement", label: "Engagement" }
];

const formSchema = z.object({
  businessType: z.string().min(2, { message: "Please enter your business type" }),
  monthlyBudget: z.string().min(1, { message: "Please enter your monthly budget" }),
  targetAudience: z.string().min(10, { message: "Please describe your target audience" }),
  preferredChannels: z.array(z.string()).optional(),
  marketingGoals: z.array(z.string()).min(1, { message: "Select at least one marketing goal" }),
  budgetFlexibility: z.number().min(0).max(100),
  timeframe: z.string().min(1, { message: "Please enter your marketing timeframe" }),
  additionalInfo: z.string().optional(),
});

interface ChannelStrategyFormProps {
  formData: ChannelStrategyFormData;
  setFormData: React.Dispatch<React.SetStateAction<ChannelStrategyFormData>>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const ChannelStrategyForm = ({
  formData,
  setFormData,
  isLoading,
  onSubmit,
}: ChannelStrategyFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: formData.businessType,
      monthlyBudget: formData.monthlyBudget,
      targetAudience: formData.targetAudience,
      preferredChannels: formData.preferredChannels,
      marketingGoals: formData.marketingGoals,
      budgetFlexibility: formData.budgetFlexibility,
      timeframe: formData.timeframe,
      additionalInfo: formData.additionalInfo,
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    setFormData(values);
    onSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel & Budget Strategy</CardTitle>
        <CardDescription>
          Define your marketing goals, budget, and preferences to get a tailored channel strategy.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="businessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., SaaS, E-commerce, Local Business" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="monthlyBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Budget ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="targetAudience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Audience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your ideal customer demographics, interests, and behaviors"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marketing Goals</FormLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {goalOptions.map((goal) => (
                      <FormField
                        key={goal.id}
                        control={form.control}
                        name="marketingGoals"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(goal.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, goal.id]);
                                  } else {
                                    field.onChange(field.value.filter((value) => value !== goal.id));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {goal.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredChannels"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Marketing Channels (Optional)</FormLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {marketingChannels.map((channel) => (
                      <FormField
                        key={channel.id}
                        control={form.control}
                        name="preferredChannels"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(channel.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value || [], channel.id]);
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== channel.id));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {channel.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Select channels you're particularly interested in (optional)
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetFlexibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Flexibility</FormLabel>
                  <div className="pt-2">
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        defaultValue={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                        className="mt-2"
                      />
                    </FormControl>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Fixed Budget</span>
                    <span>Flexible Budget</span>
                  </div>
                  <FormDescription>
                    How flexible is your budget? Can you allocate more for better-performing channels?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Timeframe</FormLabel>
                  <FormControl>
                    <Input placeholder="E.g., 3 months, 6 months, Ongoing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other details about your marketing strategy or goals"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Strategy...
                </>
              ) : (
                "Generate Channel Strategy"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ChannelStrategyForm;
