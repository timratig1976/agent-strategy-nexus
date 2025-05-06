import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import CompanyLogo from "@/components/CompanyLogo";
import { Strategy, StrategyState } from "@/types/marketing";

interface StrategyCardProps {
  strategy: Strategy;
  stateLabels: Record<StrategyState, string>;
  stateColors: Record<StrategyState, string>;
}

const StrategyCard = ({ strategy, stateLabels, stateColors }: StrategyCardProps) => {
  // Calculate progress percentage for a strategy based on completed tasks
  const calculateProgress = (strategy: Strategy): number => {
    if (strategy.tasks.length === 0) return 0;
    const completedTasks = strategy.tasks.filter(task => task.isCompleted).length;
    return Math.round((completedTasks / strategy.tasks.length) * 100);
  };

  return (
    <Link to={`/strategy-details/${strategy.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex gap-2">
              <CompanyLogo size="sm" />
              <CardTitle className="mr-2">{strategy.name}</CardTitle>
            </div>
            <Badge className={stateColors[strategy.state]}>
              {stateLabels[strategy.state]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date(strategy.updatedAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium
              ${strategy.status === 'completed' ? 'bg-green-100 text-green-800' : 
                strategy.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'}`}>
              {strategy.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{strategy.description}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{calculateProgress(strategy)}%</span>
            </div>
            <Progress value={calculateProgress(strategy)} className="h-2" />
            
            <div className="flex justify-end mt-4">
              <span className="text-xs text-muted-foreground flex items-center">
                View Details <ArrowRight className="ml-1 h-3 w-3" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StrategyCard;
