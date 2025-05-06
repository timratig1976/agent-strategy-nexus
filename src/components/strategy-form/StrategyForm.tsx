
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { StrategyState } from "@/types/marketing";
import BasicInfoSection from "./BasicInfoSection";
import CompanySection from "./CompanySection";
import ProductSection from "./ProductSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import StrategyFormActions from "./StrategyFormActions";
import StrategyFormHeader from "./StrategyFormHeader";
import { strategyFormSchema, StrategyFormValues } from "./strategyFormSchema";

const StrategyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);

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
      <StrategyFormHeader />
      
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="space-y-6">
              <BasicInfoSection form={form} />
              <CompanySection form={form} />
              <ProductSection form={form} />
              <AdditionalInfoSection form={form} />
            </CardContent>
            
            <StrategyFormActions submitting={submitting} />
          </form>
        </Form>
      </Card>
    </>
  );
};

export default StrategyForm;
