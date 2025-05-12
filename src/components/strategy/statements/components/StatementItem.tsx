
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  
  const getImpactColor = () => {
    const impact = statement.impact;
    if (type === 'pain') {
      return impact === 'high' ? 'bg-red-200 text-red-800 border-red-300' : 
             impact === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
             'bg-yellow-50 text-yellow-800 border-yellow-100';
    } else {
      return impact === 'high' ? 'bg-green-200 text-green-800 border-green-300' : 
             impact === 'medium' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
             'bg-teal-50 text-teal-800 border-teal-100';
    }
  };
  
  const getCardBorderClass = () => {
    if (type === 'pain') {
      return statement.impact === 'high' ? 'border-red-300' : 
             statement.impact === 'medium' ? 'border-amber-200' : 'border-yellow-100';
    } else {
      return statement.impact === 'high' ? 'border-green-300' : 
             statement.impact === 'medium' ? 'border-emerald-200' : 'border-teal-100';
    }
  };

  const getLeftBorderClass = () => {
    if (type === 'pain') {
      return statement.impact === 'high' ? 'border-l-4 border-l-red-500' : 
             statement.impact === 'medium' ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-yellow-500';
    } else {
      return statement.impact === 'high' ? 'border-l-4 border-l-green-500' : 
             statement.impact === 'medium' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-teal-500';
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
          <Badge className={`${getImpactColor()} font-medium`}>
            {statement.impact.charAt(0).toUpperCase() + statement.impact.slice(1)}
          </Badge>
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
