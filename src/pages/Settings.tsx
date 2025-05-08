
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import NavBar from "@/components/NavBar";
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AIPromptSettings } from "@/components/strategy/briefing/components/AIPromptSettings";

type CompanySettings = {
  name: string;
  website: string;
  logo_url: string;
};

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<CompanySettings>({
    defaultValues: {
      name: "",
      website: "",
      logo_url: "",
    },
  });

  // Fetch existing company settings
  useEffect(() => {
    const fetchCompanySettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("company_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching company settings:", error);
          throw error;
        }

        if (data) {
          form.reset({
            name: data.name || "",
            website: data.website || "",
            logo_url: data.logo_url || "",
          });

          if (data.logo_url) {
            setLogoPreview(data.logo_url);
          }
        }
      } catch (error) {
        console.error("Error fetching company settings:", error);
        toast({
          title: "Error",
          description: "Failed to load company settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanySettings();
  }, [user, form, toast]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: CompanySettings) => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      let logo_url = form.getValues("logo_url");

      // Upload logo if a new one was selected
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("company_logos")
          .upload(filePath, logoFile, {
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("company_logos")
          .getPublicUrl(filePath);

        logo_url = urlData.publicUrl;
      }

      // Check if settings already exist
      const { data: existingData } = await supabase
        .from("company_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingData) {
        // Update existing settings
        const { error } = await supabase
          .from("company_settings")
          .update({
            name: data.name,
            website: data.website,
            logo_url,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from("company_settings")
          .insert({
            user_id: user.id,
            name: data.name,
            website: data.website,
            logo_url,
          });

        if (error) throw error;
      }

      toast({
        title: "Settings saved",
        description: "Your company settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving company settings:", error);
      toast({
        title: "Error",
        description: "Failed to save company settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="company">
          <TabsList className="mb-4">
            <TabsTrigger value="company">Company Profile</TabsTrigger>
            <TabsTrigger value="ai-prompts">AI Prompt Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>
                  Manage your company information that will appear throughout the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be displayed throughout the application.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Website</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your company's website URL.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem>
                      <FormLabel>Company Logo</FormLabel>
                      <div className="flex items-start gap-4">
                        <div>
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="max-w-sm"
                          />
                          <FormDescription>
                            Upload your company logo. Recommended size: 512x512px.
                          </FormDescription>
                        </div>
                        {logoPreview && (
                          <div className="mt-2">
                            <p className="text-sm font-medium mb-1">Preview:</p>
                            <img
                              src={logoPreview}
                              alt="Logo preview"
                              className="w-20 h-20 object-contain border rounded"
                            />
                          </div>
                        )}
                      </div>
                    </FormItem>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-prompts">
            <div className="space-y-6">
              <AIPromptSettings
                module="briefing"
                title="Strategy Briefing Prompts"
                description="Customize how the AI generates strategy briefings"
              />
              
              <AIPromptSettings
                module="persona"
                title="Persona Development Prompts"
                description="Customize how the AI creates customer personas"
              />
              
              <AIPromptSettings
                module="content_strategy"
                title="Content Strategy Prompts"
                description="Customize how the AI develops content strategies"
              />
              
              {/* New USP Canvas Prompts */}
              <AIPromptSettings
                module="usp_canvas_profile"
                title="USP Canvas Profile Prompts"
                description="Customize how the AI generates customer profile elements (jobs, pains, gains)"
              />
              
              <AIPromptSettings
                module="usp_canvas_value_map"
                title="USP Canvas Value Map Prompts"
                description="Customize how the AI generates value map elements (products, pain relievers, gain creators)"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
