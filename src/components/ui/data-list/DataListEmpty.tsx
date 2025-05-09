
import React, { ReactNode } from 'react';
import { FolderOpen } from 'lucide-react';

export interface DataListEmptyProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const DataListEmpty: React.FC<DataListEmptyProps> = ({
  icon = <FolderOpen className="h-10 w-10 text-muted-foreground" />,
  title = 'No data available',
  description = 'There are no items to display at this time.',
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
