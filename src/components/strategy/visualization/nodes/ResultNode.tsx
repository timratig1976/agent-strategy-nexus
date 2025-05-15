
import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentResult } from '@/types/marketing';
import { FileText, User, FlaskConical, BarChart2, MessageSquare, ExternalLink } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ResultNodeProps {
  data: {
    label: string;
    content: string;
    type: string;
    result: AgentResult;
    onViewDetails?: (result: AgentResult) => void;
  };
  selected: boolean;
}

const ResultNode: React.FC<ResultNodeProps> = ({ data, selected }) => {
  const { label, content, type, result, onViewDetails } = data;

  // Get the appropriate icon based on result type
  const getIcon = () => {
    switch (type) {
      case 'briefing':
        return <FileText size={18} className="text-blue-500" />;
      case 'persona':
        return <User size={18} className="text-purple-500" />;
      case 'pain_gains':
        return <FlaskConical size={18} className="text-amber-500" />; 
      case 'funnel':
        return <BarChart2 size={18} className="text-green-500" />;
      case 'ads':
        return <MessageSquare size={18} className="text-pink-500" />;
      default:
        return <FileText size={18} className="text-gray-500" />;
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

  // Get background color based on result type
  const getBgColor = () => {
    switch (type) {
      case 'briefing': return 'bg-blue-50';
      case 'persona': return 'bg-purple-50';
      case 'pain_gains': return 'bg-amber-50';
      case 'funnel': return 'bg-green-50';
      case 'ads': return 'bg-pink-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className={`p-3 ${getBgColor()} rounded-md border ${getBorderColor()} ${selected ? 'ring-2 ring-primary' : ''} shadow-sm relative w-[250px]`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
        {getIcon()}
        <span className="font-medium text-sm">{label}</span>
        <Badge variant="outline" className="ml-auto text-[10px] py-0">
          {type === 'pain_gains' ? 'USP' : type}
        </Badge>
      </div>
      
      <ScrollArea className="h-[180px] w-full pr-2">
        <div className="text-xs text-gray-700 whitespace-pre-line">
          {content}
        </div>
      </ScrollArea>

      <div className="absolute bottom-2 right-2 flex items-center">
        <button 
          className="text-xs text-primary flex items-center gap-1 hover:underline"
          onClick={() => onViewDetails && onViewDetails(result)}
        >
          <ExternalLink size={12} />
          View details
        </button>
      </div>
    </div>
  );
};

export default ResultNode;
