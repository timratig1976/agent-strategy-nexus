
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AIResultsItemProps {
  item: any;
  ratingProperty: 'priority' | 'severity' | 'importance';
  ratingLabel: string;
  onAddItem?: (item: any) => void;
}

// Function to get badge color based on rating value
const getBadgeColor = (rating: string) => {
  switch (rating.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    case 'medium':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
    case 'low':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  }
};

// Function to translate rating to German
const translateRating = (rating: string): string => {
  switch(rating.toLowerCase()) {
    case 'high':
      return 'Hoch';
    case 'medium':
      return 'Mittel';
    case 'low':
      return 'Niedrig';
    default:
      return rating;
  }
};

const AIResultsItem: React.FC<AIResultsItemProps> = ({ 
  item,
  ratingProperty,
  ratingLabel,
  onAddItem
}) => {
  // Determine if this item has already been added to the canvas
  const isAlreadyAdded = item.isAdded || false;
  
  // Get the rating value
  const ratingValue = item[ratingProperty] || 'medium';

  // Handle click on the add button
  const handleAddItem = () => {
    if (onAddItem && !isAlreadyAdded) {
      onAddItem(item);
    }
  };

  return (
    <Card className={`relative border ${isAlreadyAdded ? 'border-primary/40 bg-primary/5' : 'border-border'}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <p className="text-sm">{item.content}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">{ratingLabel}:</span>
              <Badge 
                variant="secondary" 
                className={getBadgeColor(ratingValue)}
              >
                {translateRating(ratingValue)}
              </Badge>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="flex-shrink-0 h-8 w-8 p-0"
            disabled={isAlreadyAdded}
            onClick={handleAddItem}
          >
            <Plus size={16} />
            <span className="sr-only">Hinzufügen</span>
          </Button>
        </div>
        
        {isAlreadyAdded && (
          <div className="mt-2 text-xs text-muted-foreground">
            ✓ Bereits zum Canvas hinzugefügt
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResultsItem;
