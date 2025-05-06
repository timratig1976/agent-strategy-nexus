import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentType, MarketingPhase } from "@/types/marketing";
import { Projector, Users, BarChartBig, Mail, MessageSquare, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsIcon } from "lucide-react";

const MarketingAgentHub = () => {
  const navigate = useNavigate();
  const [selectedPhase, setSelectedPhase] = React.useState<MarketingPhase>("briefing");

  const handleModuleNavigation = (type: MarketingPhase) => {
    navigate(`/module?type=${type}`);
  };

  const agentModules: {
    phase: MarketingPhase;
    title: string;
    description: string;
    icon: React.ComponentType;
  }[] = [
    {
      phase: "briefing",
      title: "Project Briefing",
      description: "Define project goals, target audience, and key performance indicators.",
      icon: Projector,
    },
    {
      phase: "website_analysis",
      title: "Website Analysis",
      description: "Analyze website performance and identify areas for improvement.",
      icon: Search,
    },
    {
      phase: "persona_development",
      title: "Persona Development",
      description: "Create detailed buyer personas for targeted marketing efforts.",
      icon: Users,
    },
    {
      phase: "usp_canvas",
      title: "USP Canvas",
      description: "Define your Unique Selling Proposition using the USP Canvas.",
      icon: Projector,
    },
    {
      phase: "usp_generator",
      title: "USP Generator",
      description: "Generate unique selling propositions to differentiate your brand.",
      icon: Projector,
    },
    {
      phase: "channel_strategy",
      title: "Channel Strategy",
      description: "Determine the best marketing channels for reaching your audience.",
      icon: BarChartBig,
    },
    {
      phase: "roas_calculator",
      title: "ROAS Calculator",
      description: "Calculate return on ad spend and optimize marketing investments.",
      icon: BarChartBig,
    },
    {
      phase: "campaign_ideas",
      title: "Campaign Ideas",
      description: "Generate innovative marketing campaign ideas.",
      icon: MessageSquare,
    },
    {
      phase: "ad_creative",
      title: "Ad Creative",
      description: "Create compelling ad copy and visuals.",
      icon: MessageSquare,
    },
    {
      phase: "lead_magnets",
      title: "Lead Magnets",
      description: "Develop lead magnet ideas to attract and convert potential customers.",
      icon: Mail,
    },
    {
      phase: "content_strategy",
      title: "Content Strategy",
      description: "Develop a content strategy to attract and engage your target audience.",
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Marketing Hub</h1>
        <Button 
          variant="outline" 
          onClick={() => navigate("/ai-prompts")}
          className="flex items-center gap-2"
        >
          <SettingsIcon size={16} />
          Manage AI Prompts
        </Button>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Marketing Phase</h2>
        <Select value={selectedPhase} onValueChange={setSelectedPhase}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a phase" />
          </SelectTrigger>
          <SelectContent>
            {agentModules.map((module) => (
              <SelectItem key={module.phase} value={module.phase}>
                {module.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentModules.map((module) => (
          <Card key={module.phase} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <module.icon className="h-4 w-4" />
                <span>{module.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{module.description}</p>
              <Button
                variant="link"
                className="mt-4"
                onClick={() => handleModuleNavigation(module.phase)}
              >
                Go to {module.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MarketingAgentHub;
