
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { TaskItemProps } from "./types";

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
      <div className="flex items-center space-x-2">
        <Checkbox 
          checked={task.isCompleted}
          onCheckedChange={(checked) => onToggle(task.id, checked === true)} 
          id={task.id}
        />
        <label 
          htmlFor={task.id} 
          className={`text-sm cursor-pointer ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}
        >
          {task.title}
        </label>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onDelete(task.id)}
        className="opacity-50 hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TaskItem;
