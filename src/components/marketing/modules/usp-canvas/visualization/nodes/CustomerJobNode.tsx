
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CustomerJob } from '../../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CustomerJobNodeProps = NodeProps<CustomerJob & {
  onUpdate?: (id: string, data: Partial<CustomerJob>) => void;
  onDelete?: (id: string) => void;
}>;

const CustomerJobNode: React.FC<CustomerJobNodeProps> = ({ id, data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(data.content);
  const [editedPriority, setEditedPriority] = useState(data.priority);
  
  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-blue-600">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-blue-400">Low Priority</Badge>;
      default:
        return <Badge className="bg-blue-400">Low Priority</Badge>;
    }
  };
  
  const handleSave = () => {
    if (data.onUpdate) {
      data.onUpdate(id, {
        content: editedContent,
        priority: editedPriority
      });
    }
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?') && data.onDelete) {
      data.onDelete(id);
    }
  };
  
  const handleCancel = () => {
    setEditedContent(data.content);
    setEditedPriority(data.priority);
    setIsEditing(false);
  };

  return (
    <div className="p-3 rounded-md shadow-sm border border-blue-300 bg-white">
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="mb-2">
        {getPriorityBadge(data.priority)}
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Input
            className="text-sm"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Enter job content"
          />
          <Select
            value={editedPriority}
            onValueChange={(value) => setEditedPriority(value as 'low' | 'medium' | 'high')}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Priority" />
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

export default CustomerJobNode;
