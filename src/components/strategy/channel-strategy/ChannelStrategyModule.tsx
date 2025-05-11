
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Strategy, StrategyState } from "@/types/marketing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useStrategyNavigation from "@/hooks/useStrategyNavigation";

interface ChannelStrategyModuleProps {
  strategy: Strategy;
  briefingAgentResult?: any;
  personaAgentResult?: any;
}

const ChannelStrategyModule: React.FC<ChannelStrategyModuleProps> = ({
  strategy,
  briefingAgentResult,
  personaAgentResult,
}) => {
  const { navigateToPreviousStep, navigateToNextStep, isNavigating } = useStrategyNavigation({
    strategyId: strategy.id,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Channel Strategy</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigateToPreviousStep(StrategyState.CHANNEL_STRATEGY)}
            disabled={isNavigating}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pain & Gain Statements
          </Button>
          <Button 
            onClick={() => navigateToNextStep(StrategyState.CHANNEL_STRATEGY)}
            disabled={isNavigating}
            className="flex items-center gap-2"
          >
            Continue to Funnel Strategy
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Channel Strategy Development</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Identify and prioritize the most effective marketing channels for your target audience. 
            This step helps you focus your resources on channels that deliver the best results.
          </p>
          
          {/* Placeholder for future channel strategy UI components */}
          <div className="p-4 mt-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700">
              Channel strategy components will be implemented here. You'll be able to:
            </p>
            <ul className="list-disc list-inside mt-2 text-blue-600 space-y-1">
              <li>Analyze channel performance data</li>
              <li>Map audience personas to preferred channels</li>
              <li>Prioritize channels based on business goals</li>
              <li>Create channel-specific engagement strategies</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelStrategyModule;
