
import React from "react";
import { ContentPillar } from "./types";
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface ContentStrategyResultsProps {
  contentPillars: ContentPillar[];
  onSave: (pillar: ContentPillar) => void;
  isGenerating: boolean;
}

const ContentStrategyResults = ({
  contentPillars,
  onSave,
  isGenerating
}: ContentStrategyResultsProps) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Generated Content Pillars</h3>
      </div>
      
      {isGenerating ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Generating your content pillar strategy...
            </p>
          </div>
        </Card>
      ) : contentPillars.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No content pillars generated yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {contentPillars.map((pillar) => (
            <Card key={pillar.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{pillar.title}</CardTitle>
                <CardDescription>{pillar.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Subtopics</h4>
                  <div className="flex flex-wrap gap-2">
                    {pillar.keySubtopics.map((topic, idx) => (
                      <Badge key={idx} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="content-ideas">
                    <AccordionTrigger className="text-sm font-medium py-2">
                      Content Ideas ({pillar.contentIdeas.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {pillar.contentIdeas.map((idea, idx) => (
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
                  
                  <AccordionItem value="keywords">
                    <AccordionTrigger className="text-sm font-medium py-2">
                      Suggested Keywords
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2">
                        {pillar.keywords.map((keyword, idx) => (
                          <Badge key={idx} variant="outline">{keyword}</Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="distribution">
                    <AccordionTrigger className="text-sm font-medium py-2">
                      Distribution Strategy
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div>
                          <h5 className="text-sm font-medium">Content Formats</h5>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {pillar.contentFormats.map((format, idx) => (
                              <Badge key={idx} variant="secondary">{format}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium">Distribution Channels</h5>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {pillar.distributionChannels.map((channel, idx) => (
                              <Badge key={idx} variant="secondary">{channel}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentStrategyResults;
