
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { StoredAIResult } from '../types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ResultTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storedAIResult: StoredAIResult;
  handleAddJobs: () => void;
  handleAddPains: () => void;
  handleAddGains: () => void;
  handleAddSingleJob: (job: any) => void;
  handleAddSinglePain: (pain: any) => void;
  handleAddSingleGain: (gain: any) => void;
  formatContent: (items: any[] | undefined, onAddSingleItem?: (item: any) => void) => React.ReactNode;
  isGenerating?: boolean;
}

const ResultTabs: React.FC<ResultTabsProps> = ({
  storedAIResult,
  handleAddJobs,
  handleAddPains,
  handleAddGains,
  handleAddSingleJob,
  handleAddSinglePain,
  handleAddSingleGain,
  formatContent,
  isGenerating = false,
}) => {
  // Get counts for display
  const jobCount = storedAIResult.jobs?.length || 0;
  const painCount = storedAIResult.pains?.length || 0;
  const gainCount = storedAIResult.gains?.length || 0;
  
  // Function to render column items
  const renderColumnItems = (items: any[] | undefined, onAddSingle: (item: any) => void, title: string, count: number) => {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium">{title}</h3>
          {count > 0 && (
            <Badge variant="outline" className="ml-2">
              {count}
            </Badge>
          )}
        </div>
        
        <div className="overflow-y-auto flex-grow">
          {formatContent(items, onAddSingle)}
        </div>
        
        {items && items.length > 0 && (
          <Button 
            onClick={() => onAddSingle(items[0])}
            variant="outline"
            className="mt-3 w-full"
            size="sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add All to Canvas
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <Card>
      {isGenerating && (
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">Generating results...</span>
            <span className="text-xs text-muted-foreground">(This may take 15-30 seconds)</span>
          </div>
          <Progress value={isGenerating ? 75 : 100} className="h-1.5" />
        </div>
      )}
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Customer Jobs Column */}
          <div className="border rounded-md p-4">
            {renderColumnItems(
              storedAIResult.jobs,
              handleAddSingleJob,
              "Customer Jobs",
              jobCount
            )}
          </div>
          
          {/* Customer Pains Column */}
          <div className="border rounded-md p-4">
            {renderColumnItems(
              storedAIResult.pains,
              handleAddSinglePain,
              "Customer Pains",
              painCount
            )}
          </div>
          
          {/* Customer Gains Column */}
          <div className="border rounded-md p-4">
            {renderColumnItems(
              storedAIResult.gains,
              handleAddSingleGain,
              "Customer Gains",
              gainCount
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {storedAIResult.jobs && storedAIResult.jobs.length > 0 && (
            <Button 
              onClick={handleAddJobs}
              variant="outline"
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add All Jobs
            </Button>
          )}
          
          {storedAIResult.pains && storedAIResult.pains.length > 0 && (
            <Button 
              onClick={handleAddPains}
              variant="outline"
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add All Pains
            </Button>
          )}
          
          {storedAIResult.gains && storedAIResult.gains.length > 0 && (
            <Button 
              onClick={handleAddGains}
              variant="outline"
              className="w-full"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add All Gains
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResultTabs;
