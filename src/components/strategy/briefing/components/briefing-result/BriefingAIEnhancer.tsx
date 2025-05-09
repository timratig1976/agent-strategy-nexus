
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface BriefingAIEnhancerProps {
  enhancementText: string;
  setEnhancementText: (text: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onSubmit?: () => void;
  isGenerating?: boolean;
  progress?: number;
}

const BriefingAIEnhancer: React.FC<BriefingAIEnhancerProps> = ({
  enhancementText,
  setEnhancementText,
  isExpanded = true, // Default to expanded if not provided
  onToggleExpand = () => {}, // Default empty function if not provided
  onSubmit,
  isGenerating = false, // Default to false if not provided
  progress = 0
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(isExpanded);
  
  // Use either the prop toggle function or internal state
  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };
  
  // Use the appropriate expanded state
  const expanded = typeof isExpanded !== 'undefined' ? isExpanded : internalExpanded;
  
  return (
    <Card className="mb-4">
      <CardHeader className="py-3 cursor-pointer" onClick={handleToggle}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Special Instructions</CardTitle>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {!expanded && (
          <CardDescription className="text-xs">
            Add special instructions to enhance your AI briefing
          </CardDescription>
        )}
      </CardHeader>
      
      {expanded && (
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Provide specific instructions on how you want the AI to approach this briefing
            </p>
            <Textarea
              value={enhancementText}
              onChange={(e) => setEnhancementText(e.target.value)}
              placeholder="E.g., Focus on digital marketing strategies rather than traditional advertising. Include specific recommendations for our social media presence."
              className="min-h-[100px]"
            />
            
            {isGenerating && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Generating briefing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
            
            {onSubmit && (
              <Button 
                className="w-full mt-2" 
                onClick={onSubmit}
                disabled={isGenerating || !enhancementText.trim()}
              >
                {isGenerating ? "Processing..." : "Generate"}
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BriefingAIEnhancer;
