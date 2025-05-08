
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { StoredAIResult } from '../types';

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
}

const ResultTabs: React.FC<ResultTabsProps> = ({
  activeTab,
  setActiveTab,
  storedAIResult,
  handleAddJobs,
  handleAddPains,
  handleAddGains,
  handleAddSingleJob,
  handleAddSinglePain,
  handleAddSingleGain,
  formatContent,
}) => {
  // Get counts for badge display
  const jobCount = storedAIResult.jobs?.length || 0;
  const painCount = storedAIResult.pains?.length || 0;
  const gainCount = storedAIResult.gains?.length || 0;
  
  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b px-6 py-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs" className="relative">
              Customer Jobs
              {jobCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {jobCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="pains" className="relative">
              Pains
              {painCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {painCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="gains" className="relative">
              Gains
              {gainCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {gainCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="jobs" className="mt-0 space-y-4">
            {formatContent(storedAIResult.jobs, handleAddSingleJob)}
          </TabsContent>
          <TabsContent value="pains" className="mt-0 space-y-4">
            {formatContent(storedAIResult.pains, handleAddSinglePain)}
          </TabsContent>
          <TabsContent value="gains" className="mt-0 space-y-4">
            {formatContent(storedAIResult.gains, handleAddSingleGain)}
          </TabsContent>
        </CardContent>
        
        <CardFooter className="border-t px-6 py-3">
          {activeTab === "jobs" && storedAIResult.jobs && storedAIResult.jobs.length > 0 && (
            <Button 
              onClick={handleAddJobs}
              variant="outline"
              className="ml-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add All Jobs to Canvas
            </Button>
          )}
          
          {activeTab === "pains" && storedAIResult.pains && storedAIResult.pains.length > 0 && (
            <Button 
              onClick={handleAddPains}
              variant="outline"
              className="ml-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add All Pains to Canvas
            </Button>
          )}
          
          {activeTab === "gains" && storedAIResult.gains && storedAIResult.gains.length > 0 && (
            <Button 
              onClick={handleAddGains}
              variant="outline"
              className="ml-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add All Gains to Canvas
            </Button>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default ResultTabs;
