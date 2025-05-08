
import React from "react";
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsListProps {
  activeTab: string;
}

const TabsList: React.FC<TabsListProps> = () => {
  return (
    <ShadcnTabsList className="w-full">
      <TabsTrigger value="canvas">Canvas</TabsTrigger>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="ai-generator">AI Generator</TabsTrigger>
      <TabsTrigger value="history">History</TabsTrigger>
    </ShadcnTabsList>
  );
};

export default TabsList;
