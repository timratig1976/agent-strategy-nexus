
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Sparkles } from 'lucide-react';

interface StatementItemProps {
  id: string;
  content: string;
  impact: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
  onDelete: (id: string) => void;
}

const StatementItem: React.FC<StatementItemProps> = ({
  id,
  content,
  impact,
  isAIGenerated = false,
  onDelete
}) => {
  // Get color based on impact level
  const getImpactColor = () => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="py-3 px-4 flex justify-between items-start">
        <div className="flex gap-2 items-center">
          <Badge className={`${getImpactColor()} capitalize`}>
            {impact} impact
          </Badge>
          {isAIGenerated && (
            <Badge variant="outline" className="flex items-center gap-1 border-blue-300">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span className="text-blue-600">AI Generated</span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <p className="text-sm">{content}</p>
      </CardContent>
      <CardFooter className="py-2 px-4 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
          onClick={() => onDelete(id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StatementItem;
