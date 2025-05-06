
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { AIResultEditor } from "@/components/marketing/shared/AIResultEditor";
import { StrategyInfoCardProps } from "./types";

const StrategyInfoCard: React.FC<StrategyInfoCardProps> = ({
  formValues,
  saveStrategyMetadata,
  showCrawler,
  setShowCrawler
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Strategy Information</span>
          {!showCrawler && formValues.websiteUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCrawler(true)}
              className="flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              <span>Crawl Website</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AIResultEditor 
          title="Strategy Details"
          description="Edit strategy information to improve AI briefing"
          originalContent={{ formValues }}
          contentField="formValues"
          onSave={(updatedContent) => saveStrategyMetadata(updatedContent.formValues)}
        />
      </CardContent>
    </Card>
  );
};

export default StrategyInfoCard;
