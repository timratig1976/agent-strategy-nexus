
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { RefreshCcw } from 'lucide-react';

interface HistoryTabProps {
  canvasSaveHistory: Array<{
    timestamp: number;
    data: any;
    isFinal?: boolean;
  }>;
  refreshData?: () => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ canvasSaveHistory, refreshData }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Canvas History</CardTitle>
        {refreshData && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshData}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {canvasSaveHistory.length > 0 ? (
          <div className="space-y-4">
            {canvasSaveHistory.map((entry, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-md ${entry.isFinal ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">
                      {entry.isFinal ? 'Final Version' : `Saved Version ${canvasSaveHistory.length - index}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(entry.timestamp), 'PPpp')}
                    </p>
                  </div>
                  
                  {entry.isFinal && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Final
                    </span>
                  )}
                </div>
                
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Customer Jobs</p>
                    <p className="text-muted-foreground">{entry.data.customerJobs?.length || 0} items</p>
                  </div>
                  <div>
                    <p className="font-medium">Customer Pains</p>
                    <p className="text-muted-foreground">{entry.data.customerPains?.length || 0} items</p>
                  </div>
                  <div>
                    <p className="font-medium">Customer Gains</p>
                    <p className="text-muted-foreground">{entry.data.customerGains?.length || 0} items</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No history available yet. Save your canvas to create history entries.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTab;
