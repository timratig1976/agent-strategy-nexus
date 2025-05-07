
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";
import { StrategyFormValues } from "@/components/strategy-form";

export type CrawlUrlType = 'websiteUrl' | 'productUrl';

export function useCrawlUrl(formValues: StrategyFormValues & { id?: string }) {
  const [crawlingUrl, setCrawlingUrl] = useState<string | null>(null);
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [websitePreviewResults, setWebsitePreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [productPreviewResults, setProductPreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [showWebsitePreview, setShowWebsitePreview] = useState(false);
  const [showProductPreview, setShowProductPreview] = useState(false);

  const handleCrawl = async (urlType: CrawlUrlType) => {
    const url = formValues[urlType];
    
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
              (data.summary || formValues.companyName) : formValues.companyName,
            website_url_param: urlType === 'websiteUrl' ? url : formValues.websiteUrl,
            product_description_param: urlType === 'productUrl' ? 
              (data.summary || formValues.productDescription) : formValues.productDescription,
            product_url_param: urlType === 'productUrl' ? url : formValues.productUrl,
            additional_info_param: formValues.additionalInfo + 
              (formValues.additionalInfo ? '\n\n' : '') + 
              `Crawl results for ${urlType === 'websiteUrl' ? 'website' : 'product'} URL (${new Date().toLocaleString()}):\n` +
              `Keywords: ${(data.keywordsFound || []).join(', ')}\n` +
              `Technologies: ${(data.technologiesDetected || []).join(', ')}`
          }
        );
        
        if (saveError) {
          console.error("Error saving crawl results:", saveError);
          toast.error("Failed to save crawl results");
        } else {
          toast.success(`${urlType === 'websiteUrl' ? 'Website' : 'Product'} URL crawled successfully`);
          
          // Show the appropriate preview
          if (urlType === 'websiteUrl') {
            setShowWebsitePreview(true);
          } else {
            setShowProductPreview(true);
          }

          return {
            success: true,
            data,
            urlType,
            additionalInfo: formValues.additionalInfo + 
              (formValues.additionalInfo ? '\n\n' : '') + 
              `Crawl results for ${urlType === 'websiteUrl' ? 'website' : 'product'} URL (${new Date().toLocaleString()}):\n` +
              `Keywords: ${(data.keywordsFound || []).join(', ')}\n` +
              `Technologies: ${(data.technologiesDetected || []).join(', ')}`
          };
        }
      }
    } catch (err: any) {
      console.error(`Error crawling ${urlType}:`, err);
      toast.error(err.message || `Failed to crawl ${urlType === 'websiteUrl' ? 'website' : 'product'} URL`);
    } finally {
      setCrawlingUrl(null);
      setCrawlProgress(100);
    }
    
    return { success: false };
  };

  return {
    crawlingUrl,
    crawlProgress,
    websitePreviewResults,
    productPreviewResults,
    showWebsitePreview,
    showProductPreview,
    setShowWebsitePreview,
    setShowProductPreview,
    handleCrawl
  };
}
