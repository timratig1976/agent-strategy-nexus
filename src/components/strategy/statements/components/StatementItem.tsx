
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Sparkles } from "lucide-react";
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
      <CardContent className="pt-2 pb-1">
        <div className="flex justify-between items-start mb-1">
          {/* Only show impact badge for non-AI generated statements */}
          {!statement.isAiGenerated && (
            <Badge className={getImpactColor()}>
              {statement.impact.charAt(0).toUpperCase() + statement.impact.slice(1)} Impact
            </Badge>
          )}
          {statement.isAiGenerated && (
            <Badge variant="outline" className="bg-blue-50">
              <Sparkles className="h-3 w-3 mr-1" />
              AI
            </Badge>
          )}
        </div>
        <p className="text-sm">{statement.content}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-1 pt-0 pb-1">
        <Button variant="ghost" size="sm" onClick={() => onEdit(statement.id)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(statement.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatementItem;
