
import React from 'react';
import {
  getBezierPath,
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
} from 'reactflow';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RelationshipEdgeProps extends EdgeProps {
  data?: {
    onDelete?: (edgeId: string) => void;
    edgeType?: 'job' | 'pain' | 'gain';
  };
}

const RelationshipEdge: React.FC<RelationshipEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Get the edge type to determine styling
  const getEdgeStyle = () => {
    const baseStyle = { ...style };
    
    if (data?.edgeType === 'job') {
      return { ...baseStyle, stroke: '#3b82f6', strokeWidth: 2 }; // Blue for job relationships
    } else if (data?.edgeType === 'pain') {
      return { ...baseStyle, stroke: '#ef4444', strokeWidth: 2 }; // Red for pain relationships
    } else if (data?.edgeType === 'gain') {
      return { ...baseStyle, stroke: '#10b981', strokeWidth: 2 }; // Green for gain relationships
    }
    
    return baseStyle;
  };

  // Handle removing the connection
  const handleRemoveConnection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data?.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={getEdgeStyle()} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          className="nodrag"
        >
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRemoveConnection}
            className="w-5 h-5 bg-white rounded-full shadow-sm border border-gray-200 p-0 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default RelationshipEdge;
