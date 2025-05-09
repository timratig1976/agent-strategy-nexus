
import React from 'react';
import { ComponentContainerProps } from './types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const ComponentContainer: React.FC<ComponentContainerProps> = ({
  children,
  title,
  description,
  className = '',
  headerClassName = '',
  contentClassName = '',
  headerActions,
  footer,
  isLoading = false,
  error = null
}) => {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      {(title || headerActions) && (
        <div className={`flex items-center justify-between p-6 ${headerClassName}`}>
          {title && (
            <div>
              <h3 className="text-lg font-medium">{isLoading ? <Skeleton className="h-6 w-32" /> : title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {isLoading ? <Skeleton className="h-4 w-48" /> : description}
                </p>
              )}
            </div>
          )}
          {headerActions && (
            <div className="flex items-center space-x-2">
              {isLoading ? <Skeleton className="h-9 w-24" /> : headerActions}
            </div>
          )}
        </div>
      )}
      
      <div className={`p-6 pt-0 ${(title || headerActions) ? '' : 'pt-6'} ${contentClassName}`}>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          children
        )}
      </div>
      
      {footer && (
        <div className="border-t p-6 flex justify-end">
          {isLoading ? <Skeleton className="h-9 w-32" /> : footer}
        </div>
      )}
    </div>
  );
};

export default ComponentContainer;
