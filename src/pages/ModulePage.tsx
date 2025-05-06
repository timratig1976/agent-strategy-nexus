
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProjectBriefingModule from "@/components/marketing/modules/ProjectBriefingModule";
import WebsiteCrawlingModule from "@/components/marketing/modules/website-crawler";
import PersonaGeneratorModule from "@/components/marketing/modules/persona-generator";
import UspCanvasModule from "@/components/marketing/modules/usp-canvas";
import RoasCalculatorModule from "@/components/marketing/modules/roas-calculator";
import CampaignIdeasModule from "@/components/marketing/modules/campaign-ideas";
import AdCreativeModule from "@/components/marketing/modules/ad-creative";

const ModulePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const moduleType = searchParams.get("type") || "briefing";

  const renderModule = () => {
    switch (moduleType) {
      case "briefing":
        return <ProjectBriefingModule />;
      case "website_analysis":
        return <WebsiteCrawlingModule />;
      case "persona_development":
        return <PersonaGeneratorModule />;
      case "usp_canvas":
        return <UspCanvasModule />;
      case "roas_calculator":
        return <RoasCalculatorModule />;
      case "campaign_ideas":
        return <CampaignIdeasModule />;
      case "ad_creative":
        return <AdCreativeModule />;
      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Module Under Development</h2>
            <p className="text-muted-foreground mb-6">
              This marketing module is currently being built and will be available soon.
            </p>
            <Button onClick={() => navigate("/marketing-hub")}>
              Return to Marketing Hub
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2"
          onClick={() => navigate("/marketing-hub")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Marketing Hub</span>
        </Button>
      </div>
      
      {renderModule()}
    </div>
  );
};

export default ModulePage;
