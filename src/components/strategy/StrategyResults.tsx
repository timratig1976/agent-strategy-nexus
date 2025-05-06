
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AgentResult } from "@/types/marketing";
import { AgentResultDisplay } from "@/components/agents/AgentResultDisplay";

interface StrategyResultsProps {
  strategyId: string;
  agentResults: AgentResult[] | undefined;
}

const StrategyResults: React.FC<StrategyResultsProps> = ({ strategyId, agentResults }) => {
  return (
    <div className="space-y-6">
      {agentResults && agentResults.length > 0 ? (
        agentResults.map((result) => (
          <Card key={result.id} className="mb-6">
            <CardHeader>
              <CardTitle>{result.agentId ? "Agent Result" : "Strategy Result"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: result.content.replace(/\n/g, '<br>') }} />
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Results Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Complete tasks to generate marketing strategy results.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Display the most recent agent result from AgentResultDisplay */}
      <AgentResultDisplay strategyId={strategyId} agentId="" />
    </div>
  );
};

export default StrategyResults;
