
import React from 'react';
import { Handle, Position } from 'reactflow';

interface StageNodeProps {
  data: {
    label: string;
    icon: React.ReactNode;
    isCurrentStage: boolean;
    completed: boolean;
  };
  selected: boolean;
}

const StageNode: React.FC<StageNodeProps> = ({ data, selected }) => {
  const { label, icon, isCurrentStage, completed } = data;
  
  // Determine the styling based on stage status
  const getBackgroundColor = () => {
    if (isCurrentStage) return 'bg-blue-50';
    if (completed) return 'bg-green-50';
    return 'bg-gray-50';
  };
  
  const getBorderColor = () => {
    if (isCurrentStage) return 'border-blue-400';
    if (completed) return 'border-green-400';
    return 'border-gray-200';
  };
  
  const getIconColor = () => {
    if (isCurrentStage) return 'text-blue-500';
    if (completed) return 'text-green-500';
    return 'text-gray-400';
  };

  return (
    <div className={`p-3 rounded-md border-2 ${getBorderColor()} ${getBackgroundColor()}`}>
      <Handle type="target" position={Position.Left} />
      
      <div className="flex flex-col items-center gap-1">
        <div className={`${getIconColor()}`}>
          {icon}
        </div>
        
        <div className="font-medium text-sm text-center mt-1">
          {label}
        </div>
        
        {isCurrentStage && (
          <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full mt-1">
            Current
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default StageNode;
