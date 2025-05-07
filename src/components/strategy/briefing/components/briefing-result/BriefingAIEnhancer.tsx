
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface BriefingAIEnhancerProps {
  enhancementText: string;
  onEnhancementChange: (text: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const BriefingAIEnhancer: React.FC<BriefingAIEnhancerProps> = ({
  enhancementText,
  onEnhancementChange,
  isExpanded,
  onToggleExpand
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="py-3 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">AI Enhancement Options</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        {!isExpanded && (
          <CardDescription className="text-xs">
            Add additional information to enhance your AI briefing
          </CardDescription>
        )}
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <Tabs defaultValue="additional">
            <TabsList className="mb-4">
              <TabsTrigger value="additional">Additional Information</TabsTrigger>
              <TabsTrigger value="instructions">Special Instructions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="additional">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Add more context about your company, market, or goals to enhance the briefing
                </p>
                <Textarea
                  value={enhancementText}
                  onChange={(e) => onEnhancementChange(e.target.value)}
                  placeholder="E.g., Our target market is primarily millennials interested in sustainable products. We're looking to expand into the European market next quarter."
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="instructions">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Provide specific instructions on how you want the AI to approach this briefing
                </p>
                <Textarea
                  value={enhancementText}
                  onChange={(e) => onEnhancementChange(e.target.value)}
                  placeholder="E.g., Focus on digital marketing strategies rather than traditional advertising. Include specific recommendations for our social media presence."
                  className="min-h-[100px]"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default BriefingAIEnhancer;
