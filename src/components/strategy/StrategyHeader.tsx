
import React from "react";
import { Badge } from "@/components/ui/badge";
import CompanyLogo from "@/components/CompanyLogo";
import { Strategy } from "@/types/marketing";

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
    <div className="flex items-center gap-3 mb-2">
      <CompanyLogo size="md" />
      <h1 className="text-3xl font-bold">{strategy.name}</h1>
      <Badge className={getStateColor(strategy.state)}>
        {getStateLabel(strategy.state)}
      </Badge>
    </div>
  );
};

export default StrategyHeader;
