
import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentResult } from '@/types/marketing';
import { FileText, User, Star, BarChart2, MessageSquare } from "lucide-react";

interface ResultNodeProps {
  data: {
    label: string;
    content: string;
    type: string;
    result: AgentResult;
  };
  selected: boolean;
}

const ResultNode: React.FC<ResultNodeProps> = ({ data }) => {
  const { label, content, type } = data;

  // Get the appropriate icon based on result type
  const getIcon = () => {
    switch (type) {
      case 'briefing':
        return <FileText size={16} className="text-blue-500" />;
      case 'persona':
        return <User size={16} className="text-purple-500" />;
      case 'pain_gains':
        return <Star size={16} className="text-amber-500" />;
      case 'funnel':
        return <BarChart2 size={16} className="text-green-500" />;
      case 'ads':
        return <MessageSquare size={16} className="text-pink-500" />;
      default:
        return <FileText size={16} className="text-gray-500" />;
    }
  };

  // Get border color based on result type
  const getBorderColor = () => {
    switch (type) {
      case 'briefing': return 'border-blue-200';
      case 'persona': return 'border-purple-200';
      case 'pain_gains': return 'border-amber-200';
      case 'funnel': return 'border-green-200';
      case 'ads': return 'border-pink-200';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className={`p-3 bg-white rounded-md border ${getBorderColor()} shadow-sm`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
        {getIcon()}
        <span className="font-medium text-sm">{label}</span>
      </div>
      
      <div className="text-xs text-gray-600 h-20 overflow-y-auto">
        {content}
      </div>
    </div>
  );
};

export default ResultNode;
