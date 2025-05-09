
import React from "react";
import { Strategy } from "@/types/marketing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleViewBoard = () => {
    navigate(`/strategy-board/${strategy.id}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
      <h1 className="text-3xl font-bold">{strategy.name}</h1>
      <div className="flex items-center gap-3 mt-2 sm:mt-0">
        <Badge className={`${getStateColor(strategy.state)}`}>
          {getStateLabel(strategy.state)}
        </Badge>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewBoard}
          className="flex items-center gap-2"
        >
          <BarChart2 size={16} />
          Visualization Board
        </Button>
      </div>
    </div>
  );
};

export default StrategyHeader;
