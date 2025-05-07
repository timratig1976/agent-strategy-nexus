
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StrategyInfoCardProps } from "./types";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import StrategyForm from "./StrategyForm";

const StrategyInfoCard: React.FC<StrategyInfoCardProps> = ({
  formValues,
  saveStrategyMetadata,
  showCrawler,
  setShowCrawler
}) => {
  const [localFormValues, setLocalFormValues] = useState(formValues);
  const [isSaving, setIsSaving] = useState(false);
  const [crawlingUrl, setCrawlingUrl] = useState<string | null>(null);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [websitePreviewResults, setWebsitePreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [productPreviewResults, setProductPreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [showProductPreview, setShowProductPreview] = useState(false);
  
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

  const handleCrawl = async (urlType: 'websiteUrl' | 'productUrl') => {
    const url = localFormValues[urlType];
    
    if (!url) {
      toast.error("Please enter a URL to crawl");
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return;
    }

    setCrawlingUrl(urlType);
    setCrawlProgress(10);
    
    if (urlType === 'websiteUrl') {
      setShowWebsitePreview(false);
      setWebsitePreviewResults(null);
    } else {
      setShowProductPreview(false);
      setProductPreviewResults(null);
    }
    
    try {
      toast.info(`Crawling ${urlType === 'websiteUrl' ? 'website' : 'product'} URL...`);
      
      // Call the website crawler function
      const { data, error } = await supabase.functions.invoke('website-crawler', {
        body: { url }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        console.log(`${urlType} crawl results:`, data);
        
        // Set the appropriate preview results based on URL type
        if (urlType === 'websiteUrl') {
          setWebsitePreviewResults(data);
        } else {
          setProductPreviewResults(data);
        }
        
        // Save crawl results to the database
        const { error: saveError } = await supabase.rpc(
          'upsert_strategy_metadata',
          {
            strategy_id_param: formValues.id,
            company_name_param: urlType === 'websiteUrl' ? 
              (data.summary || localFormValues.companyName) : localFormValues.companyName,
            website_url_param: urlType === 'websiteUrl' ? url : localFormValues.websiteUrl,
            product_description_param: urlType === 'productUrl' ? 
              (data.summary || localFormValues.productDescription) : localFormValues.productDescription,
            product_url_param: urlType === 'productUrl' ? url : localFormValues.productUrl,
            additional_info_param: localFormValues.additionalInfo + 
              (localFormValues.additionalInfo ? '\n\n' : '') + 
              `Crawl results for ${urlType === 'websiteUrl' ? 'website' : 'product'} URL (${new Date().toLocaleString()}):\n` +
              `Keywords: ${(data.keywordsFound || []).join(', ')}\n` +
              `Technologies: ${(data.technologiesDetected || []).join(', ')}`
          }
        );
        
        if (saveError) {
          console.error("Error saving crawl results:", saveError);
          toast.error("Failed to save crawl results");
        } else {
          // Update local form values with the crawl results
          setLocalFormValues(prev => ({
            ...prev,
            [urlType === 'websiteUrl' ? 'companyName' : 'productDescription']: 
              data.summary || prev[urlType === 'websiteUrl' ? 'companyName' : 'productDescription'],
            additionalInfo: prev.additionalInfo + 
              (prev.additionalInfo ? '\n\n' : '') + 
              `Crawl results for ${urlType === 'websiteUrl' ? 'website' : 'product'} URL (${new Date().toLocaleString()}):\n` +
              `Keywords: ${(data.keywordsFound || []).join(', ')}\n` +
              `Technologies: ${(data.technologiesDetected || []).join(', ')}`
          }));
          
          toast.success(`${urlType === 'websiteUrl' ? 'Website' : 'Product'} URL crawled successfully`);
          
          // Show the appropriate preview
          if (urlType === 'websiteUrl') {
            setShowWebsitePreview(true);
          } else {
            setShowProductPreview(true);
          }
        }
      }
    } catch (err: any) {
      console.error(`Error crawling ${urlType}:`, err);
      toast.error(err.message || `Failed to crawl ${urlType === 'websiteUrl' ? 'website' : 'product'} URL`);
    } finally {
      setCrawlingUrl(null);
      setCrawlProgress(100);
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
