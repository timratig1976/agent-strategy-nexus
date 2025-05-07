
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { StrategyInfoCardProps } from "./types";
import StrategyForm from "./StrategyForm";
import { useCrawlUrl } from "./hooks/useCrawlUrl";

const StrategyInfoCard: React.FC<StrategyInfoCardProps> = ({
  formValues,
  saveStrategyMetadata,
  showCrawler,
  setShowCrawler
}) => {
  const [localFormValues, setLocalFormValues] = useState(formValues);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use our custom hook for crawling functionality
  const {
    crawlingUrl,
    crawlProgress,
    websitePreviewResults,
    productPreviewResults,
    showWebsitePreview,
    showProductPreview,
    setShowWebsitePreview,
    setShowProductPreview,
    handleCrawl
  } = useCrawlUrl(localFormValues);
  
  // Update local form values when formValues prop changes
  useEffect(() => {
    setLocalFormValues(formValues);
  }, [formValues]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveStrategyMetadata(localFormValues);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Strategy Information</span>
          {!showCrawler && localFormValues.websiteUrl && (
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
        <StrategyForm
          localFormValues={localFormValues}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isSaving={isSaving}
          crawlingUrl={crawlingUrl}
          handleCrawl={handleCrawl}
          crawlProgress={crawlProgress}
          websitePreviewResults={websitePreviewResults}
          productPreviewResults={productPreviewResults}
          showWebsitePreview={showWebsitePreview}
          showProductPreview={showProductPreview}
          setShowWebsitePreview={setShowWebsitePreview}
          setShowProductPreview={setShowProductPreview}
        />
      </CardContent>
    </Card>
  );
};

export default StrategyInfoCard;
