
import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentResult, StrategyState } from '@/types/marketing';
import { FileText, User, Star, BarChart2, MessageSquare } from "lucide-react";

interface StrategyNodeProps {
  data: {
    label: string;
    icon: React.ReactNode;
    isCurrentStage: boolean;
    completed: boolean;
  };
  selected: boolean;
}

const StrategyNode: React.FC<StrategyNodeProps> = ({ data }) => {
  const { label, icon, isCurrentStage, completed } = data;

  return (
    <div 
      className={`px-4 py-3 rounded-md flex flex-col items-center shadow-sm transition-all
        ${isCurrentStage ? 'bg-primary/10 border-2 border-primary ring-2 ring-primary/30' : 
          completed ? 'bg-white border border-green-300' : 'bg-white border border-gray-200'
        }`}
    >
      <Handle type="target" position={Position.Left} />
      
      <div className={`p-2 rounded-full flex items-center justify-center mb-1
        ${isCurrentStage ? 'bg-primary text-white' : 
          completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {icon}
      </div>
      
      <span className={`text-sm font-medium
        ${isCurrentStage ? 'text-primary' : 
          completed ? 'text-green-700' : 'text-gray-700'
        }`}
      >
        {label}
      </span>
      
      {completed && (
        <div className="mt-1">
          <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-xs text-green-700">
            Completed
          </span>
        </div>
      )}
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default StrategyNode;
