
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Check, ChevronDown, ChevronUp } from "lucide-react";
import { AgentResult } from "@/types/marketing";

interface BriefingContentEditorProps {
  latestBriefing: AgentResult | null;
  editedContent: string;
  setEditedContent: (content: string) => void;
  enhancementText: string;
  isGenerating: boolean;
  isSaving: boolean;
  handleSave: (isFinal: boolean) => Promise<void>;
  handleGenerateBriefing: () => void;
}

const BriefingContentEditor: React.FC<BriefingContentEditorProps> = ({
  latestBriefing,
  editedContent,
  setEditedContent,
  enhancementText,
  isGenerating,
  isSaving,
  handleSave,
  handleGenerateBriefing
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!latestBriefing) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">No briefing has been generated yet.</p>
        <Button 
          onClick={handleGenerateBriefing} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Generate AI Briefing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleToggleExpand}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="ml-1">{isExpanded ? "Collapse" : "Expand"}</span>
          </Button>
          <span className="text-xs text-muted-foreground">
            {latestBriefing.createdAt && `Last updated: ${formatDate(latestBriefing.createdAt)}`}
          </span>
        </div>
        <div>
          {latestBriefing.metadata?.is_final && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Check className="h-3.5 w-3.5" />
              Final Version
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <Textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
        />
      )}

      <div className="flex justify-between items-center pt-2">
        <Button 
          onClick={handleGenerateBriefing} 
          disabled={isGenerating || isSaving}
          className="flex items-center gap-1"
        >
          <Sparkles className="h-4 w-4" />
          Regenerate
        </Button>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)} 
            disabled={isSaving || isGenerating}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button 
            variant="default" 
            onClick={() => handleSave(true)} 
            disabled={isSaving || isGenerating}
          >
            {isSaving ? "Saving..." : "Save as Final"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BriefingContentEditor;
