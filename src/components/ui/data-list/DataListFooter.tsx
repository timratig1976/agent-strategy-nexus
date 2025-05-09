
import React from 'react';

export interface DataListFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DataListFooter: React.FC<DataListFooterProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`mt-4 flex justify-end items-center gap-2 ${className}`}>
      {children}
    </div>
  );
};
