
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthProvider";
import AgentModuleGrid from "./agents/AgentModuleGrid";
import { 
  Briefcase, 
  Globe, 
  User, 
  LayoutDashboard, 
  Zap, 
  ChartBar, 
  Calculator,
  Lightbulb,
  Image,
  Book,
  Columns3
} from "lucide-react";
import { MarketingPhase } from "@/types/marketing";

const MarketingAgentHub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleModuleClick = (moduleType: MarketingPhase) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    navigate(`/marketing/module?type=${moduleType}`);
  };

  const modules = [
    {
      title: "Project Onboarding & Briefing",
      description: "Start with defining your project goals and marketing brief",
      icon: <Briefcase className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "briefing" as MarketingPhase
    },
    {
      title: "Website Crawling",
      description: "Analyze your existing website content and structure",
      icon: <Globe className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "website_analysis" as MarketingPhase
    },
    {
      title: "Persona Generator",
      description: "Create detailed buyer personas for your target audience",
      icon: <User className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "persona_development" as MarketingPhase
    },
    {
      title: "USP Canvas Builder",
      description: "Build a unique selling proposition canvas",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "usp_canvas" as MarketingPhase
    },
    {
      title: "USP Generator",
      description: "Generate compelling unique selling propositions",
      icon: <Zap className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "usp_generator" as MarketingPhase
    },
    {
      title: "Channel & Budget Strategy",
      description: "Plan your marketing channels and budget allocation",
      icon: <ChartBar className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "channel_strategy" as MarketingPhase
    },
    {
      title: "ROAS Calculator",
      description: "Calculate return on ad spend and funnel performance",
      icon: <Calculator className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "roas_calculator" as MarketingPhase
    },
    {
      title: "Campaign Idea Generator",
      description: "Create innovative marketing campaign concepts",
      icon: <Lightbulb className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "campaign_ideas" as MarketingPhase
    },
    {
      title: "Ad Creative Module",
      description: "Generate text and visual ad creatives",
      icon: <Image className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "ad_creative" as MarketingPhase
    },
    {
      title: "Lead Magnet Suggestions",
      description: "Create compelling lead generation content",
      icon: <Book className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "lead_magnets" as MarketingPhase
    },
    {
      title: "Content Pillar Strategy",
      description: "Develop a comprehensive content pillar strategy",
      icon: <Columns3 className="h-5 w-5" />,
      isAvailable: true,
      isCompleted: false,
      moduleType: "content_strategy" as MarketingPhase
    }
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Marketing Agent Hub</h2>
        <p className="text-muted-foreground mt-2">
          Use AI-powered marketing modules to build your comprehensive marketing strategy
        </p>
      </div>
      
      <AgentModuleGrid 
        modules={modules}
        onModuleClick={(index) => handleModuleClick(modules[index].moduleType)}
      />
    </div>
  );
};

export default MarketingAgentHub;
