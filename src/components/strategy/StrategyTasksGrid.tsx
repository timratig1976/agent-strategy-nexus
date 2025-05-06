
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      {['briefing', 'persona', 'pain_gains', 'funnel', 'ads'].map((state) => (
        <div key={state} className="flex flex-col h-full">
          <TaskList
            strategyId={strategyId}
            tasks={tasks || []}
            state={state as StrategyState}
            onTasksChange={onTasksChange}
          />
        </div>
      ))}
    </div>
  );
};

export default StrategyTasksGrid;
