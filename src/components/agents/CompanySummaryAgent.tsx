
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
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [progress, setProgress] = useState(0);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const updateProgress = () => {
    // Simulate progress with steps
    const progressSteps = [10, 25, 40, 60, 75, 90];
    let step = 0;
    
    const progressInterval = setInterval(() => {
      if (step < progressSteps.length) {
        setProgress(progressSteps[step]);
        step++;
      } else {
        clearInterval(progressInterval);
      }
    }, 1500); // Update progress every 1.5 seconds
    
    return progressInterval;
  };

  const onSubmit = async (values: FormValues) => {
    if (!user || !agentId) return;

    setIsLoading(true);
    setProgress(5);
    const progressInterval = updateProgress();
    
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

      setProgress(100);
      toast({
        title: "Success",
        description: "Company summary generated successfully",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error generating company summary:", error);
      setErrorMessage(error.message || "Failed to generate company summary");
      setErrorDialogOpen(true);
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      // Ensure progress is complete or reset
      setTimeout(() => {
        if (progress < 100) {
          setProgress(0);
        }
      }, 1000);
    }
  };

  return (
    <>
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

              {isLoading && (
                <div className="my-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Processing website data</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

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

      <AlertDialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error Generating Summary</AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setErrorDialogOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
