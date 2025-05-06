
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AIResultEditor } from "@/components/marketing/shared/AIResultEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { BriefingResultCardProps } from "./types";

const BriefingResultCard: React.FC<BriefingResultCardProps> = ({
  latestBriefing,
  isGenerating,
  generateBriefing,
  saveAgentResult
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Briefing</span>
          <Button 
            onClick={generateBriefing}
            disabled={isGenerating}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? "Generating..." : latestBriefing ? "Regenerate" : "Generate"}
          </Button>
        </CardTitle>
        {!latestBriefing && !isGenerating && (
          <CardDescription>
            Generate an AI briefing based on your strategy information
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="space-y-3">
            <Skeleton className="h-[20px] w-[250px]" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-[270px]" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-[290px]" />
            <Skeleton className="h-[20px] w-full" />
          </div>
        ) : latestBriefing ? (
          <AIResultEditor 
            title="Edit Briefing"
            description="Fine-tune the AI-generated content"
            originalContent={latestBriefing}
            contentField="content"
            onSave={saveAgentResult}
          />
        ) : (
          <div className="p-6 text-center border rounded-md bg-muted/20">
            <p className="text-muted-foreground">
              No briefing has been generated yet. Click 'Generate' to create an AI briefing based on the strategy information.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BriefingResultCard;
