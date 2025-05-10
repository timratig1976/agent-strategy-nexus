
// Update the Settings.tsx page to include organization settings
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import { useOrganization } from "@/context/OrganizationProvider";
import NavBar from "@/components/NavBar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AIPromptSettingsTab, CompanyProfileTab, APIKeysTab } from "@/components/settings";
import TeamManagement from "@/components/organizations/TeamManagement";
import { useSearchParams } from "react-router-dom";

type CompanySettings = {
  name: string;
  website: string;
  logo_url: string;
};

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "company");
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Settings
          </h1>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="company">
              Company Profile
            </TabsTrigger>
            {currentOrganization && (
              <TabsTrigger value="teams">
                Teams
              </TabsTrigger>
            )}
            <TabsTrigger value="ai-prompts">
              AI Prompt Settings
            </TabsTrigger>
            <TabsTrigger value="api-keys">
              API Keys
            </TabsTrigger>
            {currentOrganization && (
              <TabsTrigger value="billing">
                Billing
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="company">
            <CompanyProfileTab 
              userId={user?.id} 
              defaultValues={companySettings} 
            />
          </TabsContent>
          
          {currentOrganization && (
            <TabsContent value="teams">
              <TeamManagement />
            </TabsContent>
          )}
          
          <TabsContent value="ai-prompts">
            <AIPromptSettingsTab />
          </TabsContent>
          
          <TabsContent value="api-keys">
            <APIKeysTab />
          </TabsContent>
          
          {currentOrganization && (
            <TabsContent value="billing">
              <div className="text-center py-12">
                <p className="mb-4">
                  Manage your subscription and billing settings in the organization settings.
                </p>
                <a 
                  href={`/organizations/${currentOrganization.id}/settings`}
                  className="text-primary hover:underline"
                >
                  Go to Organization Settings
                </a>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
