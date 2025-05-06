
import React from "react";
import { ContentPillar } from "../types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import ContentIdeasAccordion from "./ContentIdeasAccordion";
import KeywordsAccordion from "./KeywordsAccordion";
import DistributionStrategyAccordion from "./DistributionStrategyAccordion";

interface ContentPillarCardProps {
  pillar: ContentPillar;
  onSave: (pillar: ContentPillar) => void;
}

const ContentPillarCard = ({ pillar, onSave }: ContentPillarCardProps) => {
  return (
    <Card key={pillar.id} className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{pillar.title}</CardTitle>
        <CardDescription>{pillar.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Key Subtopics</h4>
          <div className="flex flex-wrap gap-2">
            {pillar.subtopics.map((topic, idx) => (
              <Badge key={idx} variant="secondary">{topic.title}</Badge>
            ))}
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {pillar.subtopics.map((subtopic, idx) => (
            <ContentIdeasAccordion key={idx} contentIdeas={subtopic.contentIdeas} />
          ))}
          <KeywordsAccordion keywords={pillar.keywords} />
          <DistributionStrategyAccordion 
            formats={pillar.formats} 
            channels={pillar.channels}
          />
        </Accordion>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline" 
          className="ml-auto flex items-center gap-2"
          onClick={() => onSave(pillar)}
        >
          <Save className="h-4 w-4" />
          Save Content Pillar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContentPillarCard;
