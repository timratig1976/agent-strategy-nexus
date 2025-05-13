
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { PainStatement, GainStatement } from "../types";

interface StatementItemProps {
  statement: PainStatement | GainStatement;
  type: 'pain' | 'gain';
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const StatementItem: React.FC<StatementItemProps> = ({ statement, type, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCardBorderClass = () => {
    if (type === 'pain') {
      return 'border-red-200';
    } else {
      return 'border-green-200';
    }
  };

  const getLeftBorderClass = () => {
    if (type === 'pain') {
      return 'border-l-4 border-l-red-500';
    } else {
      return 'border-l-4 border-l-green-500';
    }
  };

  return (
    <Card 
      className={`transition-all ${getCardBorderClass()} ${getLeftBorderClass()} ${
        isHovered ? 'shadow-md' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="pt-3 pb-3 flex items-center justify-between">
        <div className="flex-grow pr-3">
          <p className="text-sm">{statement.content}</p>
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onEdit(statement.id)} className="h-7 w-7 p-0">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(statement.id)} className="h-7 w-7 p-0">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatementItem;
