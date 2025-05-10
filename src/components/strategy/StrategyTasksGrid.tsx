
import React from "react";
import { StrategyTask, StrategyState } from "@/types/marketing";
import { TaskList } from "@/components/strategy/tasks";

interface StrategyTasksGridProps {
  strategyId: string;
  tasks: StrategyTask[];
  onTasksChange: (tasks: StrategyTask[]) => void;
}

const StrategyTasksGrid: React.FC<StrategyTasksGridProps> = ({
  strategyId,
  tasks,
  onTasksChange
}) => {
  // Define the states to display in order
  const states = [
    StrategyState.BRIEFING, 
    StrategyState.PERSONA, 
    StrategyState.PAIN_GAINS,
    StrategyState.STATEMENTS,
    StrategyState.FUNNEL, 
    StrategyState.ADS
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      {states.map((state) => (
        <div key={state} className="flex flex-col h-full">
          <TaskList
            strategyId={strategyId}
            tasks={tasks || []}
            state={state}
            onTasksChange={onTasksChange}
          />
        </div>
      ))}
    </div>
  );
};

export default StrategyTasksGrid;
