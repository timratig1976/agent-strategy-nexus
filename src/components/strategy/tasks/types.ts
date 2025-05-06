
import { StrategyState } from "@/types/marketing";

export interface TaskListProps {
  strategyId: string;
  tasks: StrategyTask[];
  state: StrategyState;
  onTasksChange: (tasks: StrategyTask[]) => void;
}

export interface StrategyTask {
  id: string;
  strategyId: string;
  title: string;
  description?: string;
  state: StrategyState;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
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
