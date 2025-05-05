
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthProvider";
import NavBar from "@/components/NavBar";
import { CompanySummaryAgent } from "@/components/agents/CompanySummaryAgent";
import { AgentResultDisplay } from "@/components/agents/AgentResultDisplay";
import { AgentPromptManager } from "@/components/agents/AgentPromptManager";
import { AgentResultEditor } from "@/components/agents/AgentResultEditor";
import { Agent } from "@/types/marketing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const CompanySummaryPage = () => {
  const { user } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchSummaryAgent = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Try to find existing agent
        const { data: existingAgent } = await supabase
          .from("agents")
          .select("*")
          .eq("name", "Company Summary Agent")
          .eq("type", "audience")
          .maybeSingle();

        if (existingAgent) {
          // Map snake_case database columns to camelCase interface properties
          setAgent({
            id: existingAgent.id,
            name: existingAgent.name,
            type: existingAgent.type,
            description: existingAgent.description || "",
            isActive: existingAgent.is_active
          });
        } else {
          // Create new agent if it doesn't exist
          const { data: newAgent, error } = await supabase
            .from("agents")
            .insert({
              name: "Company Summary Agent",
              type: "audience",
              description: "Analyzes company data from websites to create a comprehensive company summary.",
              is_active: true
            })
            .select()
            .single();

          if (error) {
            throw error;
          }

          // Map snake_case database columns to camelCase interface properties
          setAgent({
            id: newAgent.id,
            name: newAgent.name,
            type: newAgent.type,
            description: newAgent.description || "",
            isActive: newAgent.is_active
          });
        }
      } catch (error) {
        console.error("Error fetching/creating agent:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryAgent();
  }, [user]);

  const handleAgentComplete = () => {
    // Trigger refresh of the result display
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Company Summary</h1>
        <Separator className="my-6" />

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : agent ? (
          <Tabs defaultValue="agent" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="agent">Run Agent</TabsTrigger>
              <TabsTrigger value="results">View Results</TabsTrigger>
              <TabsTrigger value="edit">Edit Results</TabsTrigger>
              <TabsTrigger value="prompts">Manage Prompts</TabsTrigger>
            </TabsList>

            <TabsContent value="agent" className="space-y-6">
              <CompanySummaryAgent 
                agentId={agent.id}
                strategyId=""
                onComplete={handleAgentComplete}
              />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              <AgentResultDisplay 
                key={refreshTrigger} 
                agentId={agent.id} 
              />
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <AgentResultEditor 
                agentId={agent.id} 
                onSave={() => setRefreshTrigger(prev => prev + 1)}
              />
            </TabsContent>

            <TabsContent value="prompts" className="space-y-6">
              <AgentPromptManager agentId={agent.id} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center p-8">
            <p>Failed to load company summary agent</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanySummaryPage;
