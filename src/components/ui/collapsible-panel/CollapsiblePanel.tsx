
import React, { useState } from 'react';
import { CollapsiblePanelProps } from './types';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  children,
  defaultExpanded = false,
  icon,
  headerExtra,
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={`border rounded-lg bg-card ${className}`}
    >
      <CollapsibleTrigger className={`flex w-full items-center justify-between p-4 ${headerClassName}`}>
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center">
          {headerExtra && <div className="mr-2">{headerExtra}</div>}
          <ChevronDown 
            className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className={contentClassName}>
        <div className="p-4 pt-0 border-t">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsiblePanel;
