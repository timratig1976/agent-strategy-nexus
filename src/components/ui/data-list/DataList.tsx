
import React from 'react';
import { DataListProps } from './types';
import { DataListEmpty } from './DataListEmpty';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function DataList<T>({
  items,
  renderItem,
  keyExtractor,
  header,
  footer,
  emptyState,
  isLoading = false,
  error = null,
  className = ''
}: DataListProps<T>) {
  if (error) {
    return (
      <div className={className}>
        {header}
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        {footer}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        {header}
        <div className="space-y-3 my-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4 border p-4 rounded-md">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
        {footer}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={className}>
        {header}
        {emptyState || <DataListEmpty />}
        {footer}
      </div>
    );
  }

  return (
    <div className={className}>
      {header}
      <div className="space-y-2 my-4">
        {items.map((item, index) => (
          <div key={keyExtractor(item, index)}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {footer}
    </div>
  );
}

export default DataList;
