
import React from 'react';

export interface DataListItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export const DataListItem: React.FC<DataListItemProps> = ({
  children,
  className = '',
  onClick,
  isActive = false
}) => {
  const baseClasses = 'border rounded-md p-4 transition-colors';
  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-accent' : '';
  const activeClasses = isActive ? 'border-primary bg-primary/5' : '';
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${activeClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
