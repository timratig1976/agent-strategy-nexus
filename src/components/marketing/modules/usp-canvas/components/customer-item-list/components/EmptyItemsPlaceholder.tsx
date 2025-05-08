
import React from 'react';

interface EmptyItemsPlaceholderProps {
  message?: string;
}

const EmptyItemsPlaceholder: React.FC<EmptyItemsPlaceholderProps> = ({ 
  message = "No items available" 
}) => {
  return (
    <div className="py-4 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyItemsPlaceholder;
