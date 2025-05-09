
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgentResults } from "@/hooks/useAgentResults";

interface AgentResultDisplayProps {
  strategyId: string;
  agentId?: string | null;
  type?: string;
  title?: string;
  emptyMessage?: string;
}

export const AgentResultDisplay: React.FC<AgentResultDisplayProps> = ({ 
  strategyId,
  agentId = null,
  type,
  title = "Agent Results",
  emptyMessage = "No results available yet"
}) => {
  const { results, isLoading, error, latestResult } = useAgentResults({
    strategyId,
    agentId,
    type,
    autoLoad: true
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!latestResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  // Format content with Markdown-like rendering
  const formattedContent = latestResult.content.split('\n').map((line, index) => {
    // Handle headings
    if (line.match(/^#+\s/)) {
      const level = line.match(/^(#+)/)[0].length;
      const text = line.replace(/^#+\s/, '');
      
      switch(level) {
        case 1: return <h1 key={index} className="text-2xl font-bold mt-4">{text}</h1>;
        case 2: return <h2 key={index} className="text-xl font-bold mt-3">{text}</h2>;
        case 3: return <h3 key={index} className="text-lg font-bold mt-2">{text}</h3>;
        default: return <h4 key={index} className="text-base font-bold mt-2">{text}</h4>;
      }
    }
    
    // Handle lists
    if (line.match(/^[\s]*[-*]\s/)) {
      const text = line.replace(/^[\s]*[-*]\s/, '');
      return <li key={index} className="ml-6">{text}</li>;
    }
    
    // Handle paragraphs with spacing between them
    return line.trim() === '' ? 
      <br key={index} /> : 
      <p key={index} className="mb-2">{line}</p>;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none">
        {formattedContent}
      </CardContent>
    </Card>
  );
};
