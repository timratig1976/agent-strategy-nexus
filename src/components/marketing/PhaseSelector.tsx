
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type MarketingPhase = 
  | 'briefing'
  | 'website_analysis'
  | 'persona_development'
  | 'usp_canvas'
  | 'usp_generator'
  | 'channel_strategy'
  | 'roas_calculator'
  | 'campaign_ideas'
  | 'ad_creative'
  | 'lead_magnets'
  | 'content_strategy';

interface PhaseSelectorProps {
  onPhaseSelect: (phase: MarketingPhase) => void;
  currentStrategyId?: string;
  initialPhase?: MarketingPhase;
}

const PhaseSelector = ({ onPhaseSelect, currentStrategyId, initialPhase }: PhaseSelectorProps) => {
  const phases: Array<{
    id: MarketingPhase;
    name: string;
    description: string;
    isAdvanced?: boolean;
  }> = [
    {
      id: 'briefing',
      name: 'Marketing Brief',
      description: 'Start with basic information about your company and marketing goals.',
    },
    {
      id: 'website_analysis',
      name: 'Website Analysis',
      description: 'Analyze your website performance, SEO, and user experience.',
    },
    {
      id: 'persona_development',
      name: 'Persona Development',
      description: 'Create detailed buyer personas based on your target audience.',
    },
    {
      id: 'usp_canvas',
      name: 'USP Canvas',
      description: 'Develop a unique selling proposition using the Value Proposition Canvas approach.',
    },
    {
      id: 'usp_generator',
      name: 'USP Generator',
      description: 'Get AI-generated unique selling proposition statements for your business.',
      isAdvanced: true,
    },
    {
      id: 'channel_strategy',
      name: 'Channel Strategy',
      description: 'Determine the optimal mix of marketing channels for your business.',
      isAdvanced: true,
    },
    {
      id: 'roas_calculator',
      name: 'ROAS Calculator',
      description: 'Calculate your Return On Ad Spend across different marketing channels.',
      isAdvanced: true,
    },
    {
      id: 'campaign_ideas',
      name: 'Campaign Ideas',
      description: 'Generate creative campaign ideas based on your USP and personas.',
      isAdvanced: true,
    },
    {
      id: 'ad_creative',
      name: 'Ad Creative',
      description: 'Create ad copy and creative concepts for your campaigns.',
      isAdvanced: true,
    },
    {
      id: 'lead_magnets',
      name: 'Lead Magnets',
      description: 'Design lead magnets to attract prospects at different funnel stages.',
      isAdvanced: true,
    },
    {
      id: 'content_strategy',
      name: 'Content Strategy',
      description: 'Develop a content calendar and pillar content strategy.',
      isAdvanced: true,
    },
  ];

  // Filter phases based on whether user has selectedStrategyId or not
  const displayPhases = currentStrategyId 
    ? phases 
    : phases.filter(phase => !phase.isAdvanced);
    
  // If initialPhase is provided, scroll it into view
  React.useEffect(() => {
    if (initialPhase) {
      const phaseElement = document.getElementById(`phase-${initialPhase}`);
      if (phaseElement) {
        phaseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [initialPhase]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayPhases.map((phase) => (
          <Card 
            key={phase.id} 
            id={`phase-${phase.id}`}
            className={`hover:shadow-md transition-all cursor-pointer ${
              initialPhase === phase.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onPhaseSelect(phase.id)}
          >
            <CardHeader>
              <CardTitle>{phase.name}</CardTitle>
              <CardDescription>{phase.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="ghost"
                size="sm"
                className="ml-auto flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onPhaseSelect(phase.id);
                }}
              >
                Select <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {!currentStrategyId && displayPhases.length < phases.length && (
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Create or select an existing strategy to access advanced marketing tools such as 
            ROAS Calculator, Campaign Ideas, and more.
          </p>
        </div>
      )}
    </div>
  );
};

export default PhaseSelector;
