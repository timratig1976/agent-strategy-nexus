
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultDisplayProps {
  items: any[] | undefined;
  onAddSingleItem?: (item: any) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ items, onAddSingleItem }) => {
  if (!items || items.length === 0) return <p className="text-sm text-muted-foreground">No data available</p>;
  
  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        // Skip items without content
        if (!item || !item.content) return null;
        
        // Determine the priority/severity/importance and default to medium if invalid
        const level = item.priority || item.severity || item.importance || 'medium';
        const validLevel = ['high', 'medium', 'low'].includes(level) ? level : 'medium';
        
        return (
          <div key={index} className="p-2 border rounded-md group relative">
            <div className="flex gap-2 items-start">
              <div className={`px-1.5 py-0.5 text-xs rounded-full ${
                validLevel === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : validLevel === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {validLevel}
              </div>
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
