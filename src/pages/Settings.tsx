
import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyProfileTab } from "@/components/settings";
import { APIKeysTab } from "@/components/settings";
import { AIPromptSettingsTab } from "@/components/settings";
import StripeSetup from "@/components/settings/StripeSetup";
import { DebugSettings } from "@/components/strategy/debug";

// Dummy props for CompanyProfileTab with correct type
const dummyUserId = "current-user";
const dummyDefaultValues = {
  name: "",
  website: "",
  logo_url: ""
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("company-profile");

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="company-profile">Company Profile</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="ai-prompts">AI Prompts</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="debugging">Debugging</TabsTrigger>
          </TabsList>

          <TabsContent value="company-profile">
            <CompanyProfileTab
              userId={dummyUserId}
              defaultValues={dummyDefaultValues}
            />
          </TabsContent>
          
          <TabsContent value="api-keys">
            <APIKeysTab />
          </TabsContent>
          
          <TabsContent value="ai-prompts">
            <AIPromptSettingsTab />
          </TabsContent>
          
          <TabsContent value="billing">
            <StripeSetup />
          </TabsContent>
          
          <TabsContent value="debugging">
            <div className="grid gap-6 max-w-2xl mx-auto">
              <DebugSettings />
              
              <div className="p-4 bg-muted/50 rounded-lg border">
                <h3 className="text-md font-medium mb-2">Debug Mode Information</h3>
                <p className="text-sm text-muted-foreground">
                  When debug mode is enabled, all AI agent interactions will collect and display debug information.
                  This includes request data, response data, and prompts used.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Debug panels will appear at the bottom of relevant strategy flow pages when debug information is available.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Settings;
