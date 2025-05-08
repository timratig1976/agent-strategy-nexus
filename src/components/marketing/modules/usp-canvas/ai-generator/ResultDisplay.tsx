
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ResultDisplayProps {
  items: any[] | undefined;
  onAddSingleItem?: (item: any) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ items, onAddSingleItem }) => {
  if (!items || items.length === 0) return <p className="text-sm text-muted-foreground">No data available</p>;
  
  // Map priority/severity/importance to class names
  const getLevelBadgeClass = (level: string): string => {
    // First, normalize the level to lowercase for case-insensitive comparison
    const normalizedLevel = level?.toLowerCase();
    
    // Check if it's a valid level, considering German and English variants
    if (normalizedLevel === 'high' || normalizedLevel === 'hoch') {
      return 'bg-red-100 text-red-800';
    } else if (normalizedLevel === 'medium' || normalizedLevel === 'mittel') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (normalizedLevel === 'low' || normalizedLevel === 'niedrig') {
      return 'bg-green-100 text-green-800';
    }
    
    // Default to medium if invalid or not provided
    return 'bg-yellow-100 text-yellow-800';
  };
  
  // Function to get display text for level
  const getLevelDisplayText = (level: string): string => {
    // First, normalize the level to lowercase for case-insensitive comparison
    const normalizedLevel = level?.toLowerCase();
    
    // Return the original value if it's valid, or a default value if not
    if (['high', 'medium', 'low', 'hoch', 'mittel', 'niedrig'].includes(normalizedLevel)) {
      return level;
    }
    
    // Default to medium if invalid or not provided
    return 'medium';
  };
  
  return (
    <div className="space-y-2">
      {/* Display all items, not just the first 5 */}
      {items.map((item, index) => {
        // Skip items without content
        if (!item || !item.content) return null;
        
        // Determine the priority/severity/importance and default to medium if invalid
        const level = item.priority || item.severity || item.importance || 'medium';
        const levelBadgeClass = getLevelBadgeClass(level);
        const displayLevel = getLevelDisplayText(level);
        
        return (
          <div key={index} className="p-2 border rounded-md group relative">
            <div className="flex gap-2 items-start">
              <Badge className={`${levelBadgeClass} capitalize`}>
                {displayLevel}
              </Badge>
              <div className="flex-1 text-sm">
                {item.content}
              </div>
              {onAddSingleItem && (
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onAddSingleItem(item)}
                  title="Add this item to canvas"
                >
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Add</span>
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultDisplay;
