
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";

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
  completedPhases?: MarketingPhase[];
  currentPhase?: MarketingPhase;
}

const PhaseSelector = ({ 
  onPhaseSelect, 
  currentStrategyId, 
  initialPhase,
  completedPhases = [],
  currentPhase
}: PhaseSelectorProps) => {
  const [selectedPhase, setSelectedPhase] = useState<MarketingPhase | null>(initialPhase || null);

  const phases: Array<{
    id: MarketingPhase;
    name: string;
    description: string;
    isAdvanced?: boolean;
    category: 'discovery' | 'value' | 'planning' | 'execution';
  }> = [
    {
      id: 'briefing',
      name: 'Marketing Brief',
      description: 'Start with basic information about your company and marketing goals.',
      category: 'discovery',
    },
    {
      id: 'website_analysis',
      name: 'Website Analysis',
      description: 'Analyze your website performance, SEO, and user experience.',
      category: 'discovery',
    },
    {
      id: 'persona_development',
      name: 'Persona Development',
      description: 'Create detailed buyer personas based on your target audience.',
      category: 'discovery',
    },
    {
      id: 'usp_canvas',
      name: 'USP Canvas',
      description: 'Develop a unique selling proposition using the Value Proposition Canvas approach.',
      category: 'value',
    },
    {
      id: 'usp_generator',
      name: 'USP Generator',
      description: 'Get AI-generated unique selling proposition statements for your business.',
      isAdvanced: true,
      category: 'value',
    },
    {
      id: 'channel_strategy',
      name: 'Channel Strategy',
      description: 'Determine the optimal mix of marketing channels for your business.',
      isAdvanced: true,
      category: 'planning',
    },
    {
      id: 'roas_calculator',
      name: 'ROAS Calculator',
      description: 'Calculate your Return On Ad Spend across different marketing channels.',
      isAdvanced: true,
      category: 'planning',
    },
    {
      id: 'campaign_ideas',
      name: 'Campaign Ideas',
      description: 'Generate creative campaign ideas based on your USP and personas.',
      isAdvanced: true,
      category: 'planning',
    },
    {
      id: 'ad_creative',
      name: 'Ad Creative',
      description: 'Create ad copy and creative concepts for your campaigns.',
      isAdvanced: true,
      category: 'execution',
    },
    {
      id: 'lead_magnets',
      name: 'Lead Magnets',
      description: 'Design lead magnets to attract prospects at different funnel stages.',
      isAdvanced: true,
      category: 'execution',
    },
    {
      id: 'content_strategy',
      name: 'Content Strategy',
      description: 'Develop a content calendar and pillar content strategy.',
      isAdvanced: true,
      category: 'execution',
    },
  ];

  // Filter phases based on whether user has selectedStrategyId or not
  const displayPhases = currentStrategyId 
    ? phases 
    : phases.filter(phase => !phase.isAdvanced);
    
  // If initialPhase is provided, scroll it into view
  useEffect(() => {
    if (initialPhase) {
      const phaseElement = document.getElementById(`phase-${initialPhase}`);
      if (phaseElement) {
        phaseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [initialPhase]);

  // Handle phase selection
  const handlePhaseSelect = (phase: MarketingPhase) => {
    setSelectedPhase(phase);
    onPhaseSelect(phase);
  };

  // Group phases by category
  const categorizedPhases = displayPhases.reduce<Record<string, typeof phases>>((acc, phase) => {
    if (!acc[phase.category]) {
      acc[phase.category] = [];
    }
    acc[phase.category].push(phase);
    return acc;
  }, {});

  const categoryTitles = {
    discovery: "1. Discovery & Research",
    value: "2. Value Proposition",
    planning: "3. Strategy Planning",
    execution: "4. Execution"
  };

  const getPhaseStatus = (phaseId: MarketingPhase) => {
    if (completedPhases.includes(phaseId)) return "completed";
    if (currentPhase === phaseId) return "current";
    return "pending";
  };

  return (
    <div className="space-y-10">
      {Object.entries(categorizedPhases).map(([category, categoryPhases]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">
            {categoryTitles[category as keyof typeof categoryTitles]}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryPhases.map((phase) => {
              const phaseStatus = getPhaseStatus(phase.id);
              return (
                <Card 
                  key={phase.id} 
                  id={`phase-${phase.id}`}
                  className={`hover:shadow-md transition-all cursor-pointer relative ${
                    selectedPhase === phase.id ? 'ring-2 ring-primary' : 
                    phaseStatus === 'completed' ? 'border-green-200' :
                    phaseStatus === 'current' ? 'border-blue-200' : ''
                  }`}
                  onClick={() => handlePhaseSelect(phase.id)}
                >
                  {phaseStatus === 'completed' && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                  )}
                  {phaseStatus === 'current' && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        In Progress
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{phase.name}</CardTitle>
                      {phase.isAdvanced && !currentStrategyId && (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription>{phase.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="ml-auto flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePhaseSelect(phase.id);
                      }}
                    >
                      Select <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
      
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
