
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PainReliever } from '../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type PainRelieverNodeProps = NodeProps<PainReliever & {
  onUpdate?: (id: string, data: Partial<PainReliever>) => void;
  onDelete?: (id: string) => void;
}>;

const PainRelieverNode: React.FC<PainRelieverNodeProps> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(data.content);
  
  const handleSave = () => {
    if (data.onUpdate) {
      data.onUpdate(id, {
        content: editedContent,
        relatedPainIds: data.relatedPainIds
      });
    }
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this pain reliever?') && data.onDelete) {
      data.onDelete(id);
    }
  };
  
  const handleCancel = () => {
    setEditedContent(data.content);
    setIsEditing(false);
  };

  return (
    <div className="p-3 rounded-md shadow-sm border border-orange-300 bg-white">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="mb-2">
        <Badge className="bg-orange-500">Pain Reliever</Badge>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Input
            className="text-sm"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Enter pain reliever description"
          />
          <div className="flex justify-end space-x-1">
            <Button size="icon" variant="ghost" onClick={handleCancel}>
              <X className="h-3 w-3" />
            </Button>
            <Button size="icon" onClick={handleSave}>
              <Check className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium">{data.content}</p>
          {data.relatedPainIds.length > 0 && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                Connected to {data.relatedPainIds.length} pain{data.relatedPainIds.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}
          <div className="flex justify-end mt-2 space-x-1">
            <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
              <Pencil className="h-3 w-3" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PainRelieverNode;
