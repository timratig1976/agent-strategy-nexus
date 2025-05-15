
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentResult } from "@/types/marketing";

interface DetailedContentViewerProps {
  result: AgentResult;
  onClose: () => void;
  title?: string;
}

const DetailedContentViewer: React.FC<DetailedContentViewerProps> = ({ 
  result, 
  onClose,
  title 
}) => {
  // Determine content type and title
  const contentType = result.metadata?.type || 'briefing';
  const displayTitle = title || getResultTitle(contentType);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div>
          <CardTitle className="text-xl font-bold">{displayTitle}</CardTitle>
          <CardDescription>
            Created on {new Date(result.createdAt).toLocaleDateString()}
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{result.content}</ReactMarkdown>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Helper function to get a human-readable title for the result based on type
function getResultTitle(type: string): string {
  switch (type) {
    case 'briefing':
      return 'Strategy Briefing';
    case 'persona':
      return 'Target Persona';
    case 'pain_gains':
      return 'USP Canvas';
    case 'funnel':
      return 'Marketing Funnel Strategy';
    case 'ads':
      return 'Ad Campaign Plan';
    default:
      return 'Strategy Result';
  }
}

export default DetailedContentViewer;
