
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import PersonaEditor from "../PersonaEditor";
import { AgentResult } from "@/types/marketing";

interface BriefingDisplayProps {
  briefing: AgentResult | null;
}

export const BriefingDisplay: React.FC<BriefingDisplayProps> = ({ briefing }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Briefing</CardTitle>
      </CardHeader>
      <CardContent>
        <PersonaEditor 
          content={briefing?.content || "No briefing available"}
          readOnly={true}
        />
      </CardContent>
    </Card>
  );
};
