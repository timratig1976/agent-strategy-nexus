
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
  formatContent: (items: any[] | undefined) => React.ReactNode;
}

const ResultTabs: React.FC<ResultTabsProps> = ({
  activeTab,
  setActiveTab,
  storedAIResult,
  handleAddJobs,
  handleAddPains,
  handleAddGains,
  formatContent
}) => {
  const jobsCount = storedAIResult?.jobs?.length || 0;
  const painsCount = storedAIResult?.pains?.length || 0;
  const gainsCount = storedAIResult?.gains?.length || 0;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">AI Generated Canvas Elements</h3>
      
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
          {formatContent(storedAIResult.jobs)}
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
          {formatContent(storedAIResult.pains)}
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
          {formatContent(storedAIResult.gains)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultTabs;
