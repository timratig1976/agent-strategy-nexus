
import React from "react";
import { Button } from "@/components/ui/button";
import { WebsiteCrawlingModule } from "@/components/marketing/modules/website-crawler";
import { WebsiteCrawlerWrapperProps } from "./types";

const WebsiteCrawlerWrapper: React.FC<WebsiteCrawlerWrapperProps> = ({ 
  onBack,
  crawlResults,
  setCrawlResults
}) => {
  return (
    <div className="space-y-4">
      <WebsiteCrawlingModule 
        initialData={crawlResults}
        onResults={setCrawlResults}
      />
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onBack}
        className="mt-4"
      >
        Back to Strategy
      </Button>
    </div>
  );
};

export default WebsiteCrawlerWrapper;
