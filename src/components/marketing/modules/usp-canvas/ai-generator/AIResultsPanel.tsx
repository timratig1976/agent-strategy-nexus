
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface AIResultsPanelProps {
  title: string;
  items: any[];
  onAddItems: (items: any[]) => void;
  renderItem: (item: any, index: number) => React.ReactNode;
}

const AIResultsPanel: React.FC<AIResultsPanelProps> = ({
  title,
  items = [],
  onAddItems,
  renderItem
}) => {
  const handleAddAll = () => {
    if (items && items.length > 0) {
      onAddItems(items);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          {items && items.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddAll}
              className="flex items-center gap-1"
            >
              <PlusCircle size={16} />
              <span>Alle hinzufügen</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, index) => renderItem(item, index))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Noch keine KI-generierten Ergebnisse verfügbar. 
            Klicken Sie auf "Kundenprofil generieren", um zu beginnen.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIResultsPanel;
