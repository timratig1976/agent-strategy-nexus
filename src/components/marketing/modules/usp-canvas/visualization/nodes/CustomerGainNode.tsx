
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CustomerGain } from '../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CustomerGainNodeProps = NodeProps<CustomerGain & {
  onUpdate?: (id: string, data: Partial<CustomerGain>) => void;
  onDelete?: (id: string) => void;
}>;

const CustomerGainNode: React.FC<CustomerGainNodeProps> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(data.content);
  const [editedImportance, setEditedImportance] = useState(data.importance);
  
  const getImportanceBadge = (importance: 'low' | 'medium' | 'high') => {
    switch (importance) {
      case 'high':
        return <Badge className="bg-green-600">High Importance</Badge>;
      case 'medium':
        return <Badge className="bg-green-500">Medium Importance</Badge>;
      case 'low':
        return <Badge className="bg-green-400">Low Importance</Badge>;
      default:
        return <Badge className="bg-green-400">Low Importance</Badge>;
    }
  };
  
  const handleSave = () => {
    if (data.onUpdate) {
      data.onUpdate(id, {
        content: editedContent,
        importance: editedImportance
      });
    }
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this gain?') && data.onDelete) {
      data.onDelete(id);
    }
  };
  
  const handleCancel = () => {
    setEditedContent(data.content);
    setEditedImportance(data.importance);
    setIsEditing(false);
  };

  return (
    <div className="p-3 rounded-md shadow-sm border border-green-300 bg-white">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="mb-2">
        {getImportanceBadge(data.importance)}
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Input
            className="text-sm"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Enter gain content"
          />
          <Select
            value={editedImportance}
            onValueChange={(value) => setEditedImportance(value as 'low' | 'medium' | 'high')}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Importance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
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

export default CustomerGainNode;
