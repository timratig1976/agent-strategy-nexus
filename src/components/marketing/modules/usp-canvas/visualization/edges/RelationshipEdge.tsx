
import React from 'react';
import {
  getBezierPath,
  EdgeProps,
  BaseEdge,
  EdgeLabelRenderer,
} from 'reactflow';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RelationshipEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // This function would be passed in and would handle removing the connection
  const handleRemoveConnection = () => {
    // In a real implementation, this would remove the edge
    // and update any related data structures
    console.log('Remove connection:', id);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRemoveConnection}
            className="w-5 h-5 bg-white rounded-full shadow-sm border border-gray-200 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default RelationshipEdge;
