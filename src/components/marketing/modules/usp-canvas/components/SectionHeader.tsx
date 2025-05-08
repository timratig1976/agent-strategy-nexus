
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  tooltipTitle: string;
  tooltipContent: string;
}

const SectionHeader = ({
  title,
  tooltipTitle,
  tooltipContent
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-base font-medium">{title}</h3>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <div className="space-y-2">
              <p className="font-medium">{tooltipTitle}</p>
              <p className="text-sm">
                {tooltipContent}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SectionHeader;
