
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StoredAIResult } from '../types';
import { Badge } from "@/components/ui/badge";

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
  formatContent
}) => {
  const jobsCount = storedAIResult?.jobs?.length || 0;
  const painsCount = storedAIResult?.pains?.length || 0;
  const gainsCount = storedAIResult?.gains?.length || 0;

  // Grid layout for 3-column display when all types have content
  const allHaveContent = jobsCount > 0 && painsCount > 0 && gainsCount > 0;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">AI Generated Canvas Elements</h3>
      
      {allHaveContent ? (
        // 3-column layout when all types have content
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Jobs Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium flex items-center">
                Customer Jobs 
                <Badge className="ml-2 bg-blue-500">{jobsCount}</Badge>
              </h4>
              {jobsCount > 0 && (
                <Button size="sm" onClick={handleAddJobs} className="text-xs h-7 px-2">
                  Add All
                </Button>
              )}
            </div>
            {formatContent(storedAIResult.jobs, handleAddSingleJob)}
          </div>
          
          {/* Pains Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium flex items-center">
                Customer Pains
                <Badge className="ml-2 bg-red-500">{painsCount}</Badge>
              </h4>
              {painsCount > 0 && (
                <Button size="sm" onClick={handleAddPains} className="text-xs h-7 px-2">
                  Add All
                </Button>
              )}
            </div>
            {formatContent(storedAIResult.pains, handleAddSinglePain)}
          </div>
          
          {/* Gains Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium flex items-center">
                Customer Gains
                <Badge className="ml-2 bg-green-500">{gainsCount}</Badge>
              </h4>
              {gainsCount > 0 && (
                <Button size="sm" onClick={handleAddGains} className="text-xs h-7 px-2">
                  Add All
                </Button>
              )}
            </div>
            {formatContent(storedAIResult.gains, handleAddSingleGain)}
          </div>
        </div>
      ) : (
        // Tabs layout for smaller screens or when not all types have content
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="jobs" className="relative">
              Customer Jobs
              {jobsCount > 0 && (
                <Badge className="absolute top-0 right-1 transform translate-x-1/2 -translate-y-1/2 bg-blue-500">
                  {jobsCount}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="pains" className="relative">
              Customer Pains
              {painsCount > 0 && (
                <Badge className="absolute top-0 right-1 transform translate-x-1/2 -translate-y-1/2 bg-red-500">
                  {painsCount}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="gains" className="relative">
              Customer Gains
              {gainsCount > 0 && (
                <Badge className="absolute top-0 right-1 transform translate-x-1/2 -translate-y-1/2 bg-green-500">
                  {gainsCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Jobs ({jobsCount})</h4>
              {jobsCount > 0 && (
                <Button size="sm" onClick={handleAddJobs}>
                  Add All Jobs to Canvas
                </Button>
              )}
            </div>
            {formatContent(storedAIResult.jobs, handleAddSingleJob)}
          </TabsContent>
          
          <TabsContent value="pains" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Pains ({painsCount})</h4>
              {painsCount > 0 && (
                <Button size="sm" onClick={handleAddPains}>
                  Add All Pains to Canvas
                </Button>
              )}
            </div>
            {formatContent(storedAIResult.pains, handleAddSinglePain)}
          </TabsContent>
          
          <TabsContent value="gains" className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Gains ({gainsCount})</h4>
              {gainsCount > 0 && (
                <Button size="sm" onClick={handleAddGains}>
                  Add All Gains to Canvas
                </Button>
              )}
            </div>
            {formatContent(storedAIResult.gains, handleAddSingleGain)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ResultTabs;
