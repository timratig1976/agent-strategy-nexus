
import React from "react";
import AgentModule, { AgentModuleProps } from "./AgentModule";

interface AgentModuleGridProps {
  modules: Omit<AgentModuleProps, "onClick">[];
  onModuleClick: (index: number) => void;
}

const AgentModuleGrid = ({ modules, onModuleClick }: AgentModuleGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((module, index) => (
        <AgentModule
          key={index}
          {...module}
          onClick={() => onModuleClick(index)}
        />
      ))}
    </div>
  );
};

export default AgentModuleGrid;
