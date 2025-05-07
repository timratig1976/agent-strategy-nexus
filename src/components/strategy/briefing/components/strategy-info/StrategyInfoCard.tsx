
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <CardTitle>Strategy Information</CardTitle>
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
