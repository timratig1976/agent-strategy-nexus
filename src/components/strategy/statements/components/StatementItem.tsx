
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
      return impact === 'high' ? 'bg-red-100 text-red-800' : 
             impact === 'medium' ? 'bg-amber-100 text-amber-800' : 
             'bg-yellow-50 text-yellow-800';
    } else {
      return impact === 'high' ? 'bg-green-100 text-green-800' : 
             impact === 'medium' ? 'bg-emerald-100 text-emerald-800' : 
             'bg-teal-50 text-teal-800';
    }
  };

  return (
    <Card 
      className={`transition-all ${type === 'pain' ? 'border-red-100' : 'border-green-100'} ${
        isHovered ? 'shadow-md' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="pt-2 pb-1 flex items-center justify-between">
        <div className="flex-grow">
          <p className="text-sm">{statement.content}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          {!statement.isAiGenerated && (
            <Badge className={`ml-2 ${getImpactColor()}`}>
              {statement.impact.charAt(0).toUpperCase()}
            </Badge>
          )}
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
