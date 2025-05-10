
import React from 'react';
import { NodeProps } from 'reactflow';

type CanvasSectionNodeProps = NodeProps<{
  label: string;
  description?: string;
}>;

const CanvasSectionNode: React.FC<CanvasSectionNodeProps> = ({ data }) => {
  return (
    <div className="py-2 px-4 rounded-md text-center">
      <h3 className="font-medium text-sm">{data.label}</h3>
      {data.description && (
        <p className="text-xs text-muted-foreground">{data.description}</p>
      )}
    </div>
  );
};

export default CanvasSectionNode;
