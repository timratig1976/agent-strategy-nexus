
import React from 'react';
import { Trash2 } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatementItemProps {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

const StatementItem: React.FC<StatementItemProps> = ({
  id,
  content,
  impact,
  isAIGenerated,
  onDelete,
  onEdit
}) => {
  const getImpactColor = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Card className={cn(
      "transition-all border",
      isAIGenerated ? "border-blue-200 bg-blue-50" : ""
    )}>
      <CardContent className="pt-6">
        <p className="text-sm text-gray-700">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getImpactColor(impact)}>
            {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
          </Badge>
          
          {isAIGenerated && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              AI Generated
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatementItem;
