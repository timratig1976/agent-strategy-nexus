
import React from "react";
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsListProps {
  activeTab: string;
}

const TabsList: React.FC<TabsListProps> = ({ activeTab }) => {
  return (
    <ShadcnTabsList className="w-full">
      <TabsTrigger 
        value="canvas" 
        className="relative"
      >
        Canvas
        {activeTab === "canvas" && (
          <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="overview" 
        className="relative"
      >
        Overview
        {activeTab === "overview" && (
          <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="ai-generator" 
        className="relative"
      >
        AI Generator
        {activeTab === "ai-generator" && (
          <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="history" 
        className="relative"
      >
        History
        {activeTab === "history" && (
          <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
        )}
      </TabsTrigger>
    </ShadcnTabsList>
  );
};

export default TabsList;
