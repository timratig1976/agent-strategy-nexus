
import React from "react";
import { TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabItem } from "@/components/ui/tabbed-content/types";

interface TabsListProps {
  activeTab: string;
  onTabChange?: (value: string) => void;
  onSave: () => Promise<void>;
  isProcessing: boolean;
  tabs?: TabItem[];
  children?: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ activeTab, onTabChange, onSave, isProcessing, tabs, children }) => {
  return (
    <ShadcnTabsList className="w-full">
      {children ? (
        React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          
          // Handle both direct TabsTrigger and TabsTrigger inside TooltipTrigger
          const isTrigger = child.type === TabsTrigger;
          const isTooltipWithTrigger = child.props?.children?.type === TabsTrigger;
          
          if (isTrigger) {
            // Direct TabsTrigger element - properly type the props
            return React.cloneElement(child as React.ReactElement<any>, {
              className: `relative ${child.props.className || ''}`,
              children: (
                <>
                  {child.props.children}
                  {activeTab === child.props.value && (
                    <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
                  )}
                </>
              )
            });
          } else if (isTooltipWithTrigger) {
            // Handle TooltipTrigger containing TabsTrigger - properly type the props
            const tooltipChild = child.props.children;
            return React.cloneElement(child as React.ReactElement<any>, {
              children: React.cloneElement(tooltipChild as React.ReactElement<any>, {
                className: `relative ${tooltipChild.props.className || ''}`,
                children: (
                  <>
                    {tooltipChild.props.children}
                    {activeTab === tooltipChild.props.value && (
                      <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
                    )}
                  </>
                )
              })
            });
          }
          
          // Return other children unchanged
          return child;
        })
      ) : tabs ? (
        // Render from tabs array if provided
        tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id}
            value={tab.id} 
            className="relative"
            onClick={() => onTabChange && onTabChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
            )}
          </TabsTrigger>
        ))
      ) : (
        // Default tabs if nothing else provided
        <>
          <TabsTrigger 
            value="canvas" 
            className="relative"
            onClick={() => onTabChange && onTabChange("canvas")}
          >
            Canvas
            {activeTab === "canvas" && (
              <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="visualization" 
            className="relative"
            onClick={() => onTabChange && onTabChange("visualization")}
          >
            Visualization
            {activeTab === "visualization" && (
              <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="ai_gen" 
            className="relative"
            onClick={() => onTabChange && onTabChange("ai_gen")}
          >
            AI Generator
            {activeTab === "ai_gen" && (
              <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="history" 
            className="relative"
            onClick={() => onTabChange && onTabChange("history")}
          >
            History
            {activeTab === "history" && (
              <span className="absolute -bottom-[2px] left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"></span>
            )}
          </TabsTrigger>
        </>
      )}
    </ShadcnTabsList>
  );
};

export default TabsList;
