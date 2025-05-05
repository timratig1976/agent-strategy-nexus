import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentResult } from "@/types/marketing";
import { Skeleton } from "@/components/ui/skeleton";

interface AgentResultDisplayProps {
  agentId: string;
  strategyId?: string;
}

export const AgentResultDisplay: React.FC<AgentResultDisplayProps> = ({ agentId, strategyId }) => {
  const [result, setResult] = useState<AgentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentResult = async () => {
      try {
        setLoading(true);
        const query = supabase
          .from("agent_results")
          .select("*")
          .eq("agent_id", agentId)
          .order("created_at", { ascending: false })
          .limit(1);

        if (strategyId) {
          query.eq("strategy_id", strategyId);
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          // Map snake_case database columns to camelCase interface properties
          // Ensure metadata is an object or default to empty object
          const metadataAsRecord = typeof data.metadata === 'object' && data.metadata !== null 
            ? data.metadata as Record<string, any> 
            : {};
            
          const mappedResult: AgentResult = {
            id: data.id,
            agentId: data.agent_id,
            strategyId: data.strategy_id || "",
            content: data.content,
            createdAt: data.created_at,
            metadata: metadataAsRecord,
          };
          setResult(mappedResult);
        }
      } catch (err) {
        console.error("Error fetching agent result:", err);
        setError("Failed to load agent result");
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgentResult();
    }
  }, [agentId, strategyId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Results</CardTitle>
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

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Run the agent to generate results</p>
        </CardContent>
      </Card>
    );
  }

  // Format content with Markdown-like rendering
  const formattedContent = result.content.split('\n').map((line, index) => {
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
        <CardTitle>Company Summary</CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none">
        {formattedContent}
      </CardContent>
    </Card>
  );
};
