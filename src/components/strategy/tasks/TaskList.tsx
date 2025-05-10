
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { TaskListProps } from "./types";
import { stateLabels } from "./taskUtils";
import { useTaskOperations } from "./useTaskOperations";
import TaskItem from "./TaskItem";
import NewTaskForm from "./NewTaskForm";

const TaskList: React.FC<TaskListProps> = ({ 
  strategyId, 
  tasks, 
  state, 
  onTasksChange 
}) => {
  const stateTasks = tasks.filter(task => task.state === state);
  const [isAdding, setIsAdding] = useState(false);
  
  const {
    handleToggleTask,
    handleDeleteTask,
  } = useTaskOperations(tasks, onTasksChange);

  // Updated to pass the tasks array to onTasksChange
  const handleTaskAdded = () => {
    setIsAdding(false);
    // Signal to parent that tasks have changed and need to be refreshed
    onTasksChange(tasks);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{stateLabels[state]}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stateTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))}
          
          {isAdding ? (
            <NewTaskForm
              strategyId={strategyId}
              state={state}
              onTaskAdded={handleTaskAdded}
              onCancel={() => setIsAdding(false)}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="w-full justify-start text-muted-foreground"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add task
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;
