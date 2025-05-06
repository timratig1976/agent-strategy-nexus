
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
import { ArrowLeft, Save, Users, Hash, FileText, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ContentStrategyResultsProps {
  contentPillars: ContentPillar[];
  onSave: (pillar: ContentPillar) => void;
  onBack: () => void;
}

const ContentStrategyResults = ({
  contentPillars,
  onSave,
  onBack
}: ContentStrategyResultsProps) => {
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Generator
      </Button>

      <h3 className="text-xl font-semibold mb-4">Your Content Pillar Strategy</h3>
      
      {contentPillars.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No content pillars generated yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {contentPillars.map((pillar) => (
            <Card key={pillar.id} className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{pillar.title}</CardTitle>
                <CardDescription>{pillar.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Target Audience:</span>
                  <span className="text-sm">{pillar.targetAudience}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Key Subtopics:</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {pillar.keySubtopics.map((subtopic, index) => (
                      <Badge key={index} variant="outline">{subtopic}</Badge>
                    ))}
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="keywords">
                    <AccordionTrigger className="text-sm py-2">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span>Keywords</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {pillar.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">{keyword}</Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="content-ideas">
                    <AccordionTrigger className="text-sm py-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Content Ideas ({pillar.contentIdeas.length})</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ScrollArea className="h-[200px] w-full">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Format</TableHead>
                              <TableHead>Channel</TableHead>
                              <TableHead>Effort</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pillar.contentIdeas.map((idea, index) => (
                              <TableRow key={index}>
                                <TableCell>{idea.title}</TableCell>
                                <TableCell>{idea.format}</TableCell>
                                <TableCell>{idea.channel}</TableCell>
                                <TableCell>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      idea.estimatedEffort === "Low" 
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : idea.estimatedEffort === "Medium"
                                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                    }
                                  >
                                    {idea.estimatedEffort}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="distribution">
                    <AccordionTrigger className="text-sm py-2">
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        <span>Distribution Strategy</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium">Content Formats:</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {pillar.contentFormats.map((format, index) => (
                              <Badge key={index} variant="outline">{format}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Distribution Channels:</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {pillar.distributionChannels.map((channel, index) => (
                              <Badge key={index} variant="outline">{channel}</Badge>
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
                  Save Pillar
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
