
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface CompanySummaryAgentProps {
  agentId: string;
  strategyId: string;
  onComplete?: () => void;
}

interface FormValues {
  websiteUrl: string;
}

export const CompanySummaryAgent: React.FC<CompanySummaryAgentProps> = ({ agentId, strategyId, onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companyName, setCompanyName] = useState<string>("");

  const form = useForm<FormValues>({
    defaultValues: {
      websiteUrl: "",
    },
  });

  // Fetch company settings when component mounts
  React.useEffect(() => {
    const fetchCompanySettings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("company_settings")
        .select("name, website")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching company settings:", error);
        return;
      }

      if (data) {
        setCompanyName(data.name || "");
        if (data.website) {
          form.setValue("websiteUrl", data.website);
        }
      }
    };

    fetchCompanySettings();
  }, [user, form]);

  const onSubmit = async (values: FormValues) => {
    if (!user || !agentId) return;

    setIsLoading(true);
    try {
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke("company-data-agent", {
        body: {
          companyName: companyName,
          websiteUrl: values.websiteUrl,
          agentId: agentId,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to generate company summary");
      }

      toast({
        title: "Success",
        description: "Company summary generated successfully",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error generating company summary:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate company summary",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Company Summary Agent</CardTitle>
        <CardDescription>
          This agent will analyze your company website and generate a comprehensive summary
          including market positioning, products, and target personas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your company website URL for the agent to analyze
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading || !companyName}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Company Summary"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {companyName ? (
            <span>Analyzing: {companyName}</span>
          ) : (
            <span className="text-amber-500">
              Please set your company name in settings first
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
