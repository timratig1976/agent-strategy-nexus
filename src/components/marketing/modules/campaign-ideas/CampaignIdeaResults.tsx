
import React from "react";
import { CampaignIdea } from "./types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, User, Calendar, DollarSign, Hash } from "lucide-react";

interface CampaignIdeaResultsProps {
  campaignIdeas: CampaignIdea[];
  onSave: (idea: CampaignIdea) => void;
  onBack: () => void;
}

const CampaignIdeaResults = ({
  campaignIdeas,
  onSave,
  onBack
}: CampaignIdeaResultsProps) => {
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

      <h3 className="text-xl font-semibold mb-4">Generated Campaign Ideas</h3>
      
      {campaignIdeas.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No campaign ideas generated yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {campaignIdeas.map((idea) => (
            <Card key={idea.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{idea.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{idea.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {idea.channels.map((channel) => (
                    <Badge key={channel} variant="secondary">{channel}</Badge>
                  ))}
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-sm py-2">
                      Campaign Details
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Objectives:</span>
                          <span className="text-sm">{idea.objectives.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Target Audience:</span>
                          <span className="text-sm">{idea.targetAudience}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Est. Budget:</span>
                          <span className="text-sm">{idea.estimatedBudget}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Est. Timeframe:</span>
                          <span className="text-sm">{idea.estimatedTimeframe}</span>
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
                  onClick={() => onSave(idea)}
                >
                  <Save className="h-4 w-4" />
                  Save Idea
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignIdeaResults;
