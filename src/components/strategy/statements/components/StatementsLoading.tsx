
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatementsLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <div className="space-x-2">
          <Skeleton className="h-10 w-36 inline-block" />
          <Skeleton className="h-10 w-36 inline-block" />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            
            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-20 w-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatementsLoading;
