
import React from 'react';

interface ResultDisplayProps {
  items: any[] | undefined;
  onAddSingleItem?: (item: any) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ items, onAddSingleItem }) => {
  if (!items || items.length === 0) return <p>No data available</p>;
  
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        // Skip items without content
        if (!item || !item.content) return null;
        
        // Determine the priority/severity/importance and default to medium if invalid
        const level = item.priority || item.severity || item.importance || 'medium';
        const validLevel = ['high', 'medium', 'low'].includes(level) ? level : 'medium';
        
        return (
          <div key={index} className="p-3 border rounded-md">
            <div className="flex gap-2 items-start">
              <div className={`px-2 py-1 text-xs rounded-full ${
                validLevel === 'high' 
                  ? 'bg-red-100 text-red-800' 
                  : validLevel === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {validLevel}
              </div>
              <div className="flex-1">
                {item.content}
              </div>
              {onAddSingleItem && (
                <button 
                  onClick={() => onAddSingleItem(item)} 
                  className="ml-2 p-1 text-xs bg-primary/10 hover:bg-primary/20 rounded text-primary"
                  title="Add this item to canvas"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultDisplay;
