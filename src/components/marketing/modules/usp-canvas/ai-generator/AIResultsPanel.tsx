
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

interface AIResultsPanelProps {
  title: string;
  items: Array<any>;
  onAddItems: (items: Array<any>) => void;
  onAddSingleItem?: (item: any) => void;
  renderItem: (item: any, index: number) => React.ReactNode;
}

const AIResultsPanel: React.FC<AIResultsPanelProps> = ({
  title,
  items,
  onAddItems,
  onAddSingleItem,
  renderItem
}) => {
  const handleAddToCanvas = () => {
    if (items && items.length > 0) {
      // Clone items to ensure we pass clean objects
      const itemsToAdd = items.map(item => ({...item}));
      onAddItems(itemsToAdd);
      
      console.log(`Adding ${items.length} items to canvas:`, itemsToAdd);
      // Toast notification is shown by the parent component after save is complete
    } else {
      toast.warning("No items to add");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-y-auto">
        <div className="space-y-3">
          {items && items.length > 0 ? (
            items.map((item, index) => {
              // If onAddSingleItem is provided, pass a modified renderItem
              if (onAddSingleItem) {
                const originalItem = renderItem(item, index);
                // Clone the element and add the onAddItem prop
                return React.cloneElement(originalItem, {
                  key: `item-${index}`,
                  onAddItem: () => onAddSingleItem(item)
                });
              }
              return React.cloneElement(renderItem(item, index), { key: `item-${index}` });
            })
          ) : (
            <p className="text-sm text-muted-foreground">No items generated yet.</p>
          )}
        </div>
      </CardContent>
      
      {items && items.length > 0 && (
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleAddToCanvas}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add All to Canvas
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AIResultsPanel;
