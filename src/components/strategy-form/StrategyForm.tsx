
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { StrategyState } from "@/types/marketing";
import BasicInfoSection from "./BasicInfoSection";
import CompanySection from "./CompanySection";
import ProductSection from "./ProductSection";
import AdditionalInfoSection from "./AdditionalInfoSection";
import StrategyFormActions from "./StrategyFormActions";
import StrategyFormHeader from "./StrategyFormHeader";
import { strategyFormSchema, StrategyFormValues } from "./strategyFormSchema";
import { useApiClient } from "@/hooks/useApiClient";

const StrategyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = React.useState(false);
  const api = useApiClient("");

  const form = useForm<StrategyFormValues>({
    resolver: zodResolver(strategyFormSchema),
    defaultValues: {
      name: "",
      companyName: "",
      websiteUrl: "",
      productDescription: "",
      productUrl: "",
      additionalInfo: "",
      language: "english"
    }
  });

  const handleSubmit = async (values: StrategyFormValues) => {
    if (!user) {
      toast.error("You must be signed in to create a strategy");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Create the strategy via our Prisma-backed API
      const res = await api.post<{ id: string }>("/api/strategies", {
        name: values.name,
      });
      const strategyId = res.id;

      toast.success("Strategy created successfully!");
      // Navigate to the strategy overview page
      navigate(`/strategy-overview/${strategyId}`);
      
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
