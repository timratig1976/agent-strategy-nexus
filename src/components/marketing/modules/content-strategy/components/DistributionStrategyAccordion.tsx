
import React from "react";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface DistributionStrategyAccordionProps {
  formats: string[];
  channels: string[];
}

const DistributionStrategyAccordion = ({ 
  formats, 
  channels 
}: DistributionStrategyAccordionProps) => {
  return (
    <AccordionItem value="distribution">
      <AccordionTrigger className="text-sm font-medium py-2">
        Distribution Strategy
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2">
          <div>
            <h5 className="text-sm font-medium">Content Formats</h5>
            <div className="flex flex-wrap gap-2 mt-1">
              {formats.map((format, idx) => (
                <Badge key={idx} variant="secondary">{format}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium">Distribution Channels</h5>
            <div className="flex flex-wrap gap-2 mt-1">
              {channels.map((channel, idx) => (
                <Badge key={idx} variant="secondary">{channel}</Badge>
              ))}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DistributionStrategyAccordion;
