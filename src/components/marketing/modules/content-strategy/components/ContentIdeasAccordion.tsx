
import React from "react";
import { ContentIdea } from "../types";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ContentIdeasAccordionProps {
  contentIdeas: ContentIdea[];
}

const ContentIdeasAccordion = ({ contentIdeas }: ContentIdeasAccordionProps) => {
  return (
    <AccordionItem value="content-ideas">
      <AccordionTrigger className="text-sm font-medium py-2">
        Content Ideas ({contentIdeas.length})
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          {contentIdeas.map((idea, idx) => (
            <div key={idx} className="border rounded-md p-3 bg-secondary/20">
              <div className="flex justify-between">
                <h5 className="font-medium">{idea.title}</h5>
                <Badge variant="outline" className="text-xs">{idea.format}</Badge>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {idea.description}
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ContentIdeasAccordion;
