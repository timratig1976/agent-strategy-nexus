
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import NavBar from "@/components/NavBar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { StrategyState } from "@/types/marketing";

const strategyFormSchema = z.object({
  name: z.string().min(3, { message: "Strategy name must be at least 3 characters" }),
  description: z.string().optional(),
  companyName: z.string().min(2, { message: "Company name is required" }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  productDescription: z.string().optional(),
  productUrl: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  additionalInfo: z.string().optional()
});

type StrategyFormValues = z.infer<typeof strategyFormSchema>;

const CreateStrategy = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      companyName: "",
      websiteUrl: "",
      productDescription: "",
      productUrl: "",
      additionalInfo: ""
    }
  });

  const handleSubmit = async (values: StrategyFormValues) => {
    if (!user) {
      toast.error("You must be signed in to create a strategy");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create the strategy
      const { data: strategy, error: strategyError } = await supabase
        .from('strategies')
        .insert({
          name: values.name,
          description: values.description || "",
          user_id: user.id,
          company_name: values.companyName,
          website_url: values.websiteUrl || "",
          product_description: values.productDescription || "",
          product_url: values.productUrl || "",
          additional_info: values.additionalInfo || "",
          status: 'in_progress',
          state: 'briefing' as StrategyState
        })
        .select()
        .single();
      
      if (strategyError) throw strategyError;
      
      // Add initial briefing task
      const initialTask = {
        strategy_id: strategy.id,
        title: "Create AI Briefing",
        state: 'briefing' as StrategyState,
        is_completed: false
      };
      
      const { error: taskError } = await supabase
        .from('strategy_tasks')
        .insert(initialTask);
      
      if (taskError) throw taskError;
      
      toast.success("Strategy created successfully!");
      // Navigate to the strategy overview page
      navigate(`/strategy-overview/${strategy.id}`);
      
    } catch (error) {
      console.error('Error creating strategy:', error);
      toast.error("Failed to create strategy");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-start mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Marketing Strategy</CardTitle>
            </CardHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <CardContent className="space-y-6">
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
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your marketing strategy and objectives..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="websiteUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://yourcompany.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
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
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Processing..." : "Create Strategy"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CreateStrategy;
