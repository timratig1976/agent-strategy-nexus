import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Globe, ExternalLink } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { Strategy, StrategyState } from "@/types/marketing";

interface StrategyCardProps {
  strategy: Strategy;
  stateLabels: Record<StrategyState, string>;
  stateColors: Record<StrategyState, string>;
}

const StrategyCard = ({ strategy, stateLabels, stateColors }: StrategyCardProps) => {
  // Calculate progress percentage for a strategy based on state
  const calculateProgress = (strategy: Strategy): number => {
    // Map each state to a percentage value
    const stateProgressMap: Record<StrategyState, number> = {
      [StrategyState.BRIEFING]: 16,
      [StrategyState.PERSONA]: 33,
      [StrategyState.PAIN_GAINS]: 50,
      [StrategyState.STATEMENTS]: 66,
      [StrategyState.FUNNEL]: 83,
      [StrategyState.ADS]: 100,
      [StrategyState.COMPLETED]: 100
    };
    
    return stateProgressMap[strategy.state as StrategyState] || 0;
  };

  // Get language code from strategy (default to 'EN' if not specified)
  const languageCode = strategy.metadata?.language || 'EN';

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          {/* Logo and headline in one row */}
          <div className="flex items-center gap-3">
            <CardTitle className="mr-2">{strategy.name}</CardTitle>
            <CompanyLogo size="sm" />
          </div>
        </div>
        
        {/* Date and language in one row */}
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground">
            {new Date(strategy.updatedAt).toLocaleDateString()}
          </p>
          <div className="flex items-center">
            <Globe className="h-4 w-4 text-muted-foreground" aria-label="Language" />
            <span className="text-xs font-medium ml-1 text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
              {languageCode}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Status and current state in one row */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded text-xs font-medium
            ${strategy.status === 'completed' ? 'bg-green-100 text-green-800' : 
              strategy.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'}`}>
            {strategy.status.replace('_', ' ').toUpperCase()}
          </span>
          
          <Badge className={stateColors[strategy.state as StrategyState]}>
            {stateLabels[strategy.state as StrategyState]}
          </Badge>
        </div>
        
        {/* Progress bar showing actual state */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{calculateProgress(strategy)}%</span>
          </div>
          <Progress value={calculateProgress(strategy)} className="h-2" />
          
          <div className="flex justify-between mt-4">
            <Link 
              to={`/strategy/${strategy.id}`} 
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" /> 
              Strategy Data
            </Link>
            <Link 
              to={`/strategy-details/${strategy.id}?tab=${strategy.state}`} 
              className="text-xs text-muted-foreground hover:text-blue-600 flex items-center"
            >
              Go to {stateLabels[strategy.state as StrategyState] || 'Dashboard'} <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyCard;
