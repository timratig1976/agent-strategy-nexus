
import React from "react";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface KeywordsAccordionProps {
  keywords: string[];
}

const KeywordsAccordion = ({ keywords }: KeywordsAccordionProps) => {
  return (
    <AccordionItem value="keywords">
      <AccordionTrigger className="text-sm font-medium py-2">
        Suggested Keywords
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, idx) => (
            <Badge key={idx} variant="outline">{keyword}</Badge>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default KeywordsAccordion;
