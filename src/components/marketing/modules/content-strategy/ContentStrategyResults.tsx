
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Save } from "lucide-react";
import { type ContentPillar, ContentPillarCardProps, ContentIdeasAccordionProps, KeywordsAccordionProps, DistributionStrategyAccordionProps, LoadingStateProps, EmptyStateProps } from "./types";
import { useToast } from "@/components/ui/use-toast";

interface ContentStrategyResultsProps {
  pillar: ContentPillar;
  onReset: () => void;
  onSave: () => void;
}

const ContentStrategyResults = ({ pillar, onReset, onSave }: ContentStrategyResultsProps) => {
  return (
    <div className="space-y-6">
      <ContentPillarCard pillar={pillar} onSave={onSave} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Keywords Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <KeywordsAccordion keywords={pillar.keywords} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionStrategyAccordion formats={pillar.formats} channels={pillar.channels} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Content Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentIdeasAccordion subtopics={pillar.subtopics} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onReset}>
            Create New Strategy
          </Button>
          <Button variant="default" onClick={exportToCalendar}>
            <Download className="h-4 w-4 mr-2" />
            Export to Calendar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Helper function to export content strategy to calendar
const exportToCalendar = () => {
  // Create events for Google Calendar
  const events = [];
  const now = new Date();
  
  // Create an .ics file for calendar export
  const icsContent = 
    "BEGIN:VCALENDAR\n" +
    "VERSION:2.0\n" +
    "CALSCALE:GREGORIAN\n" +
    "PRODID:-//Content Pillar Strategy//EN\n" +
    "METHOD:PUBLISH\n" +
    "X-WR-CALNAME:Content Calendar\n" +
    "X-WR-TIMEZONE:UTC\n" +
    "BEGIN:VEVENT\n" +
    "DTSTART:" + formatIcsDate(now) + "\n" +
    "DTEND:" + formatIcsDate(new Date(now.getTime() + 3600000)) + "\n" +
    "DTSTAMP:" + formatIcsDate(now) + "\n" +
    "UID:" + crypto.randomUUID() + "\n" +
    "CREATED:" + formatIcsDate(now) + "\n" +
    "DESCRIPTION:Start your content pillar creation\n" +
    "LAST-MODIFIED:" + formatIcsDate(now) + "\n" +
    "LOCATION:\n" +
    "SEQUENCE:0\n" +
    "STATUS:CONFIRMED\n" +
    "SUMMARY:Create Content Pillar\n" +
    "TRANSP:OPAQUE\n" +
    "END:VEVENT\n" +
    "END:VCALENDAR";

  // Create a Blob with the .ics content
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  
  // Create a link element to download the file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'content_calendar.ics';
  link.click();
  
  // Clean up
  URL.revokeObjectURL(link.href);
};

const formatIcsDate = (date: Date): string => {
  // Format date as required by ICS format: YYYYMMDDTHHMMSSZ
  return date.getUTCFullYear() +
    (date.getUTCMonth() + 1).toString().padStart(2, '0') +
    date.getUTCDate().toString().padStart(2, '0') + 'T' +
    date.getUTCHours().toString().padStart(2, '0') +
    date.getUTCMinutes().toString().padStart(2, '0') +
    date.getUTCSeconds().toString().padStart(2, '0') + 'Z';
};

// Component for displaying content pillar card
const ContentPillarCard = ({ pillar, onSave }: ContentPillarCardProps) => {
  const { toast } = useToast();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(pillar.description);
    toast({
      title: "Copied to clipboard",
      description: "Content pillar description copied",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{pillar.title}</CardTitle>
          <Button variant="outline" size="sm" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Strategy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{pillar.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {pillar.keywords.slice(0, 5).map((keyword, index) => (
            <Badge key={index} variant="secondary">{keyword}</Badge>
          ))}
          {pillar.keywords.length > 5 && (
            <Badge variant="outline">+{pillar.keywords.length - 5} more</Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {pillar.subtopics.map((subtopic, index) => (
            <div key={index} className="border rounded-lg p-3">
              <h4 className="font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                {subtopic.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{subtopic.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for content ideas accordion
const ContentIdeasAccordion = ({ subtopics }: ContentIdeasAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {subtopics.map((subtopic, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{subtopic.title}</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {subtopic.contentIdeas.map((idea, ideaIndex) => (
                <div key={ideaIndex} className="border rounded-md p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{idea.title}</h4>
                    <Badge>{idea.format}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{idea.description}</p>
                  {idea.example && (
                    <div className="mt-2 text-xs bg-muted p-2 rounded">
                      <strong>Example:</strong> {idea.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

// Component for keywords accordion
const KeywordsAccordion = ({ keywords }: KeywordsAccordionProps) => {
  // Group keywords by assumed intent/category
  const groupedKeywords = {
    "Primary Keywords": keywords.slice(0, 3),
    "Secondary Keywords": keywords.slice(3, 8),
    "Long-tail Keywords": keywords.slice(8)
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(groupedKeywords).map(([group, groupKeywords], index) => (
        groupKeywords.length > 0 && (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{group}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2">
                {groupKeywords.map((keyword, keywordIndex) => (
                  <Badge key={keywordIndex} variant="outline">{keyword}</Badge>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      ))}
    </Accordion>
  );
};

// Component for distribution strategy accordion
const DistributionStrategyAccordion = ({ formats, channels }: DistributionStrategyAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-0">
        <AccordionTrigger>Content Formats</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2">
            {formats.map((format, index) => (
              <Badge key={index} variant="secondary">{format}</Badge>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-1">
        <AccordionTrigger>Distribution Channels</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-wrap gap-2">
            {channels.map((channel, index) => (
              <Badge key={index} variant="outline">{channel}</Badge>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// Loading state component
const LoadingState = ({ message = "Generating content strategy..." }: LoadingStateProps) => {
  return (
    <Card className="flex justify-center items-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
};

// Empty state component
const EmptyState = ({ message = "Start by creating a content strategy" }: EmptyStateProps) => {
  return (
    <Card className="flex justify-center items-center p-8">
      <div className="text-center">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </Card>
  );
};

export default ContentStrategyResults;
