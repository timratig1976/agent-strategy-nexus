
import React from 'react';

export interface DataListHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const DataListHeader: React.FC<DataListHeaderProps> = ({
  title,
  description,
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
};
