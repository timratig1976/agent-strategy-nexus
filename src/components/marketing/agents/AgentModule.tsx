
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AgentModuleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isAvailable: boolean;
  isCompleted?: boolean;
  onClick: () => void;
  className?: string;
}

const AgentModule = ({
  title,
  description,
  icon,
  isAvailable,
  isCompleted = false,
  onClick,
  className
}: AgentModuleProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200", 
        isAvailable ? "hover:shadow-md cursor-pointer" : "opacity-70",
        isCompleted && "border-green-500 bg-green-50/50 dark:bg-green-900/10",
        className
      )}
      onClick={isAvailable ? onClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-md bg-primary/10">
            {icon}
          </div>
          {isCompleted && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              Completed
            </span>
          )}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant={isCompleted ? "outline" : "default"} 
          className="w-full"
          disabled={!isAvailable}
        >
          {isCompleted ? "View Results" : "Start"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentModule;
