
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AgentType } from "@/types/marketing";

const AGENT_TYPES: { id: AgentType; name: string; description: string }[] = [
  { 
    id: "audience", 
    name: "Audience Analysis", 
    description: "Analyzes your target audience and creates detailed persona profiles." 
  },
  { 
    id: "content", 
    name: "Content Strategy", 
    description: "Develops content ideas and calendar based on audience and trends."
  },
  { 
    id: "seo", 
    name: "SEO Optimization", 
    description: "Recommends keywords and optimization strategies for better search ranking."
  },
  { 
    id: "social", 
    name: "Social Media", 
    description: "Creates social media strategy and content recommendations."
  },
  { 
    id: "email", 
    name: "Email Marketing", 
    description: "Develops email campaign strategies and content templates."
  },
  { 
    id: "analytics", 
    name: "Analytics & Reporting", 
    description: "Sets up KPIs and reports on marketing performance metrics."
  }
];

const CreateStrategy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<AgentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAgentToggle = (agentType: AgentType) => {
    setSelectedAgents((prev) =>
      prev.includes(agentType)
        ? prev.filter((a) => a !== agentType)
        : [...prev, agentType]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a strategy name",
        variant: "destructive",
      });
      return;
    }

    if (selectedAgents.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one agent",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert the new strategy
      const { data: strategyData, error: strategyError } = await supabase
        .from('strategies')
        .insert({
          name,
          description,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select('id')
        .single();

      if (strategyError) throw strategyError;

      // Insert the agents for this strategy
      const agentsToInsert = selectedAgents.map(agentType => {
        const agentInfo = AGENT_TYPES.find(a => a.id === agentType);
        return {
          strategyId: strategyData.id,
          type: agentType,
          name: agentInfo?.name || agentType,
          description: agentInfo?.description || "",
          isActive: true
        };
      });

      const { error: agentsError } = await supabase
        .from('agents')
        .insert(agentsToInsert);

      if (agentsError) throw agentsError;

      toast({
        title: "Success",
        description: "Strategy created successfully!",
      });

      navigate(`/strategy/${strategyData.id}`);
    } catch (error) {
      console.error('Error creating strategy:', error);
      toast({
        title: "Error",
        description: "Failed to create strategy",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Marketing Strategy</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Strategy Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Strategy Name</Label>
              <Input
                id="name"
                placeholder="Enter strategy name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your marketing strategy goals"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-4">
              <Label>Select Marketing Agents</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AGENT_TYPES.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedAgents.includes(agent.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleAgentToggle(agent.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`agent-${agent.id}`}
                        checked={selectedAgents.includes(agent.id)}
                        onCheckedChange={() => handleAgentToggle(agent.id)}
                      />
                      <div>
                        <Label
                          htmlFor={`agent-${agent.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {agent.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {agent.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Strategy"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateStrategy;
