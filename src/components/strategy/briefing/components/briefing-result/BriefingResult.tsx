
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from "lucide-react";
import { AIResultEditor } from "@/components/marketing/shared/AIResultEditor";
import { Skeleton } from "@/components/ui/skeleton";
import { AgentResult } from "@/types/marketing";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export interface BriefingResultProps {
  latestBriefing: AgentResult | null;
  isGenerating: boolean;
  generateBriefing: () => Promise<void>;
  saveAgentResult: (result: AgentResult) => Promise<boolean>;
  briefingHistory: AgentResult[];
  setBriefingHistory: (history: AgentResult[]) => void;
}

export const BriefingResult: React.FC<BriefingResultProps> = ({
  latestBriefing,
  isGenerating,
  generateBriefing,
  saveAgentResult,
  briefingHistory,
  setBriefingHistory
}) => {
  const [selectedBriefingId, setSelectedBriefingId] = useState<string | null>(
    latestBriefing ? latestBriefing.id : null
  );

  const selectedBriefing = selectedBriefingId 
    ? briefingHistory.find(b => b.id === selectedBriefingId) || latestBriefing
    : latestBriefing;

  const handleSelectBriefing = (value: string) => {
    setSelectedBriefingId(value);
  };

  const handleSaveBriefing = async () => {
    if (!selectedBriefing) return;

    const result = await saveAgentResult({
      ...selectedBriefing,
      metadata: {
        ...selectedBriefing.metadata,
        is_final: true,
        saved_at: new Date().toISOString()
      }
    });

    if (result) {
      toast.success("Briefing saved as final version");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>AI Briefing</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={generateBriefing}
              disabled={isGenerating}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? "Generating..." : latestBriefing ? "Regenerate" : "Generate"}
            </Button>
            {selectedBriefing && (
              <Button 
                onClick={handleSaveBriefing}
                disabled={isGenerating || (selectedBriefing.metadata && selectedBriefing.metadata.is_final)}
                className="flex items-center gap-1"
              >
                <Save className="h-4 w-4" />
                Save Final
              </Button>
            )}
          </div>
        </div>
        {!latestBriefing && !isGenerating && (
          <CardDescription>
            Generate an AI briefing based on your strategy information
          </CardDescription>
        )}
        {briefingHistory.length > 1 && (
          <div className="mt-2">
            <CardDescription className="mb-1">Select version:</CardDescription>
            <Select 
              value={selectedBriefingId || ''} 
              onValueChange={handleSelectBriefing}
            >
              <SelectTrigger className="w-full sm:w-[300px]">
                <SelectValue placeholder="Select a version" />
              </SelectTrigger>
              <SelectContent>
                {briefingHistory.map((briefing) => (
                  <SelectItem key={briefing.id} value={briefing.id}>
                    {briefing.metadata?.version 
                      ? `Version ${briefing.metadata.version}` 
                      : 'Version'} - {formatDate(briefing.createdAt)}
                    {briefing.metadata?.is_final ? ' (Final)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
        ) : selectedBriefing ? (
          <AIResultEditor 
            title="Edit Briefing"
            description="Fine-tune the AI-generated content"
            originalContent={selectedBriefing}
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
