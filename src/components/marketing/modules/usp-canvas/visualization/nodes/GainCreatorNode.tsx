
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GainCreator } from '../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type GainCreatorNodeProps = NodeProps<GainCreator & {
  onUpdate?: (id: string, data: Partial<GainCreator>) => void;
  onDelete?: (id: string) => void;
}>;

const GainCreatorNode: React.FC<GainCreatorNodeProps> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(data.content);
  
  const handleSave = () => {
    if (data.onUpdate) {
      data.onUpdate(id, {
        content: editedContent,
        relatedGainIds: data.relatedGainIds
      });
    }
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this gain creator?') && data.onDelete) {
      data.onDelete(id);
    }
  };
  
  const handleCancel = () => {
    setEditedContent(data.content);
    setIsEditing(false);
  };

  return (
    <div className="p-3 rounded-md shadow-sm border border-emerald-300 bg-white">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="mb-2">
        <Badge className="bg-emerald-500">Gain Creator</Badge>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Input
            className="text-sm"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Enter gain creator description"
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
          {data.relatedGainIds.length > 0 && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                Connected to {data.relatedGainIds.length} gain{data.relatedGainIds.length !== 1 ? 's' : ''}
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

export default GainCreatorNode;
