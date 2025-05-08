
import React from 'react';

interface ResultDisplayProps {
  items: any[] | undefined;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ items }) => {
  if (!items || items.length === 0) return <p>No data available</p>;
  
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="p-3 border rounded-md">
          <div className="flex gap-2 items-start">
            <div className={`px-2 py-1 text-xs rounded-full ${
              item.priority === 'high' || item.severity === 'high' || item.importance === 'high' 
                ? 'bg-red-100 text-red-800' 
                : item.priority === 'medium' || item.severity === 'medium' || item.importance === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {item.priority || item.severity || item.importance || 'medium'}
            </div>
            <div className="flex-1">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultDisplay;
