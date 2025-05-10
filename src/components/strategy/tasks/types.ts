
import { StrategyState, StrategyTask } from "@/types/marketing";

export interface TaskListProps {
  strategyId: string;
  tasks: StrategyTask[];
  state: StrategyState;
  onTasksChange: (tasks: StrategyTask[]) => void;
}

export interface NewTaskFormProps {
  strategyId: string;
  state: StrategyState;
  onTaskAdded: (task: StrategyTask) => void;
  onCancel: () => void;
}

export interface TaskItemProps {
  task: StrategyTask;
  onToggle: (taskId: string, isCompleted: boolean) => void;
  onDelete: (taskId: string) => void;
}
