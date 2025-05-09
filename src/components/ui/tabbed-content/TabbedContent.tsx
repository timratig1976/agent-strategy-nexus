
import React, { useState, useEffect } from 'react';
import { TabbedContentProps } from './types';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

const TabbedContent: React.FC<TabbedContentProps> = ({
  tabs,
  defaultTabId,
  activeTabId,
  onTabChange,
  className = '',
  tabsClassName = '',
  contentClassName = '',
  variant = 'default'
}) => {
  // Use the first tab as default if not provided
  const initialTabId = defaultTabId || activeTabId || (tabs.length > 0 ? tabs[0].id : '');
  const [currentTab, setCurrentTab] = useState(initialTabId);
  
  // Sync with parent component if controlled
  useEffect(() => {
    if (activeTabId !== undefined) {
      setCurrentTab(activeTabId);
    }
  }, [activeTabId]);
  
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
    if (activeTabId === undefined) {
      setCurrentTab(value);
    }
  };
  
  // Apply variant classes
  const getVariantClass = () => {
    switch (variant) {
      case 'outline':
        return 'rounded-lg border';
      case 'underline':
        return 'border-b';
      default:
        return '';
    }
  };
  
  return (
    <Tabs
      value={currentTab}
      onValueChange={handleTabChange}
      className={`w-full ${className}`}
    >
      <TabsList className={`w-full ${getVariantClass()} ${tabsClassName}`}>
        {tabs.map((tab) => (
          tab.tooltip ? (
            <TooltipProvider key={tab.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger 
                    value={tab.id} 
                    disabled={tab.disabled}
                    className="relative"
                  >
                    {tab.label}
                    {typeof tab.count === 'number' && (
                      <Badge 
                        variant="secondary" 
                        className="ml-2 px-1 py-0 h-5 min-w-5 text-xs flex items-center justify-center"
                      >
                        {tab.count}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>{tab.tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              disabled={tab.disabled}
              className="relative"
            >
              {tab.label}
              {typeof tab.count === 'number' && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 px-1 py-0 h-5 min-w-5 text-xs flex items-center justify-center"
                >
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          )
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent 
          key={tab.id} 
          value={tab.id}
          className={contentClassName}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabbedContent;
