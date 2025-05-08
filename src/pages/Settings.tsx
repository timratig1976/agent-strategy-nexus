
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import NavBar from "@/components/NavBar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AIPromptSettingsTab, CompanyProfileTab } from "@/components/settings";

type CompanySettings = {
  name: string;
  website: string;
  logo_url: string;
};

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: "",
    website: "",
    logo_url: "",
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
          setCompanySettings({
            name: data.name || "",
            website: data.website || "",
            logo_url: data.logo_url || "",
          });
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
  }, [user, toast]);

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
            <CompanyProfileTab 
              userId={user?.id} 
              defaultValues={companySettings} 
            />
          </TabsContent>
          
          <TabsContent value="ai-prompts">
            <AIPromptSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
