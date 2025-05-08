
import React from "react";
import { Strategy } from "@/types/marketing";
import { Badge } from "@/components/ui/badge";

interface StrategyHeaderProps {
  strategy: Strategy;
  getStateLabel: (state: string) => string;
  getStateColor: (state: string) => string;
}

const StrategyHeader: React.FC<StrategyHeaderProps> = ({
  strategy,
  getStateLabel,
  getStateColor
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h1 className="text-3xl font-bold">{strategy.name}</h1>
      <Badge className={`${getStateColor(strategy.state)} mt-2 sm:mt-0`}>
        {getStateLabel(strategy.state)}
      </Badge>
    </div>
  );
};

export default StrategyHeader;
