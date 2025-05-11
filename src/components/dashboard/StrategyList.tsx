
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Strategy, StrategyState } from "@/types/marketing";
import StrategyCard from "./StrategyCard";

interface StrategyListProps {
  strategies: Strategy[];
  stateLabels: Record<StrategyState, string>;
  stateColors: Record<StrategyState, string>;
}

const StrategyList = ({ strategies, stateLabels, stateColors }: StrategyListProps) => {
  if (strategies.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center h-60">
          <p className="text-xl text-gray-500 mb-4">No marketing strategies yet</p>
          <Link to="/create-strategy">
            <Button>Create Your First Strategy</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          stateLabels={stateLabels}
          stateColors={stateColors}
        />
      ))}
    </div>
  );
};

export default StrategyList;
