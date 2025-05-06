
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ContentPillar } from "./types";
import { Calendar, Download, Loader2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ContentPillarCard, ContentIdeasAccordion, KeywordsAccordion, DistributionStrategyAccordion, EmptyState, LoadingState } from "./components";

interface ContentStrategyResultsProps {
  results: ContentPillar | null;
  isLoading: boolean;
  onSave: () => void;
  isSaving: boolean;
  onGenerateMore: () => void;
}

const ContentStrategyResults = ({
  results,
  isLoading,
  onSave,
  isSaving,
  onGenerateMore,
}: ContentStrategyResultsProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (!results) {
    return <EmptyState />;
  }
  
  const exportToCalendar = async () => {
    setIsExporting(true);
    try {
      // Generate ICS file content for calendar export
      const icsContent = generateICSContent(results);
      
      // Create a downloadable file
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${results.title.replace(/\s+/g, '_')}_content_calendar.ics`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Calendar exported",
        description: "Content calendar has been downloaded as an ICS file.",
      });
    } catch (error) {
      console.error("Error exporting calendar:", error);
      toast({
        title: "Export failed",
        description: "Could not export calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const generateICSContent = (pillar: ContentPillar): string => {
    // ICS file header
    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lovable//Content Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
    ].join('\r\n') + '\r\n';
    
    // Get start date (today)
    const startDate = new Date();
    
    // Add content ideas as events, spaced weekly
    pillar.contentIdeas.forEach((idea, index) => {
      // Calculate event date (start from today, add 7 days for each item)
      const eventDate = new Date(startDate);
      eventDate.setDate(eventDate.getDate() + (index * 7)); // One piece of content per week
      
      const uid = `content-${pillar.id}-${index}-${Date.now()}`;
      const dateString = eventDate.toISOString().replace(/[-:.]/g, '').split('T')[0];
      const timeString = 'T100000'; // 10:00 AM
      const endTimeString = 'T110000'; // 11:00 AM (1 hour duration)
      
      // Format description with useful information
      const description = [
        `Content Title: ${idea.title}`,
        `Format: ${idea.format}`,
        `Distribution Channel: ${idea.channel}`,
        `Target Audience: ${idea.audience}`,
        `Effort: ${idea.estimatedEffort}`,
        `Part of Content Pillar: ${pillar.title}`
      ].join('\\n');
      
      // Add event to ICS content
      ics += [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').split('T')[0]}T000000Z`,
        `DTSTART:${dateString}${timeString}`,
        `DTEND:${dateString}${endTimeString}`,
        `SUMMARY:Create: ${idea.title}`,
        `DESCRIPTION:${description}`,
        'END:VEVENT'
      ].join('\r\n') + '\r\n';
    });
    
    // Close ICS file
    ics += 'END:VCALENDAR';
    
    return ics;
  };
  
  const downloadContentStrategy = () => {
    if (!results) return;
    
    try {
      // Create a formatted text version of the content strategy
      const content = [
        `# Content Pillar Strategy: ${results.title}`,
        `\nDate: ${new Date().toLocaleDateString()}`,
        `\n## Description`,
        results.description,
        `\n## Target Audience`,
        results.targetAudience,
        `\n## Key Subtopics`,
        ...results.keySubtopics.map(topic => `- ${topic}`),
        `\n## Content Ideas`,
        ...results.contentIdeas.map(idea => 
          `### ${idea.title}\n- Format: ${idea.format}\n- Channel: ${idea.channel}\n- Audience: ${idea.audience}\n- Effort: ${idea.estimatedEffort}`
        ),
        `\n## Keywords`,
        ...results.keywords.map(keyword => `- ${keyword}`),
        `\n## Content Formats`,
        ...results.contentFormats.map(format => `- ${format}`),
        `\n## Distribution Channels`,
        ...results.distributionChannels.map(channel => `- ${channel}`),
      ].join('\n');
      
      // Create a downloadable file
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      // Create a link element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${results.title.replace(/\s+/g, '_')}_strategy.md`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Strategy downloaded",
        description: "Content strategy has been downloaded as a Markdown file.",
      });
    } catch (error) {
      console.error("Error downloading strategy:", error);
      toast({
        title: "Download failed",
        description: "Could not download content strategy. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">{results.title}</h2>
          <p className="text-muted-foreground">
            Created on {new Date(results.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={exportToCalendar}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
            Export to Calendar
          </Button>
          <Button 
            variant="outline" 
            onClick={downloadContentStrategy}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Strategy
          </Button>
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Strategy
          </Button>
        </div>
      </div>
      
      <ContentPillarCard pillar={results} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentIdeasAccordion contentIdeas={results.contentIdeas} />
        <div className="space-y-6">
          <KeywordsAccordion keywords={results.keywords} />
          <DistributionStrategyAccordion 
            formats={results.contentFormats} 
            channels={results.distributionChannels} 
          />
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          onClick={onGenerateMore}
          className="min-w-[200px]"
        >
          Generate More Ideas
        </Button>
      </div>
    </div>
  );
};

export default ContentStrategyResults;
