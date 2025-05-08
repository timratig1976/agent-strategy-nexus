
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { StoredAIResult } from '../types';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab} 
      defaultValue="jobs"
    >
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="jobs" 
                className={`relative ${activeTab === "jobs" ? "font-medium" : ""}`}
              >
                Customer Jobs
                {storedAIResult.jobs && storedAIResult.jobs.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-blue-100 text-xs text-blue-800">
                    {storedAIResult.jobs.length}
                  </span>
                )}
                {activeTab === "jobs" && (
                  <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
                )}
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-sm">Tasks customers are trying to complete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="pains" 
                className={`relative ${activeTab === "pains" ? "font-medium" : ""}`}
              >
                Customer Pains
                {storedAIResult.pains && storedAIResult.pains.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-100 text-xs text-red-800">
                    {storedAIResult.pains.length}
                  </span>
                )}
                {activeTab === "pains" && (
                  <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
                )}
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-sm">Frustrations, problems, and obstacles customers face</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <TabsTrigger 
                value="gains" 
                className={`relative ${activeTab === "gains" ? "font-medium" : ""}`}
              >
                Customer Gains
                {storedAIResult.gains && storedAIResult.gains.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full bg-green-100 text-xs text-green-800">
                    {storedAIResult.gains.length}
                  </span>
                )}
                {activeTab === "gains" && (
                  <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
                )}
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-sm">Benefits and outcomes customers want to achieve</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TabsList>
      
      <TabsContent value="jobs">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Generated Customer Jobs</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleAddJobs} 
                      disabled={!storedAIResult.jobs || storedAIResult.jobs.length === 0}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add All to Canvas
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm">Add all generated jobs to your customer profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              The tasks your customers are trying to complete or problems they're trying to solve.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formatContent(storedAIResult.jobs)}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="pains">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Generated Customer Pains</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleAddPains} 
                      disabled={!storedAIResult.pains || storedAIResult.pains.length === 0}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add All to Canvas
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm">Add all generated pains to your customer profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              The negative experiences, risks, and obstacles customers face.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formatContent(storedAIResult.pains)}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="gains">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Generated Customer Gains</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleAddGains} 
                      disabled={!storedAIResult.gains || storedAIResult.gains.length === 0}
                      className="flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add All to Canvas
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-sm">Add all generated gains to your customer profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              The benefits and positive outcomes your customers expect or would be surprised by.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formatContent(storedAIResult.gains)}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ResultTabs;
