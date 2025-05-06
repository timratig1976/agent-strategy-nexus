
import React from "react";
import { ContentIdeaItem } from "../types";
import { 
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ContentIdeasAccordionProps {
  contentIdeas: ContentIdeaItem[];
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
                <Badge variant="outline" className="text-xs">{idea.estimatedEffort} effort</Badge>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>Format: <span className="text-foreground">{idea.format}</span></div>
                <div>Channel: <span className="text-foreground">{idea.channel}</span></div>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ContentIdeasAccordion;
