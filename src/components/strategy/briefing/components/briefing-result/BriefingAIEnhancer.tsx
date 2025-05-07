
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface BriefingAIEnhancerProps {
  enhancementText: string;
  setEnhancementText: (text: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const BriefingAIEnhancer: React.FC<BriefingAIEnhancerProps> = ({
  enhancementText,
  setEnhancementText,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="py-3 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Special Instructions</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {!isExpanded && (
          <CardDescription className="text-xs">
            Add special instructions to enhance your AI briefing
          </CardDescription>
        )}
      </CardHeader>
      
      {isExpanded && (
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
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default BriefingAIEnhancer;
