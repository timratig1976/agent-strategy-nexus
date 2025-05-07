
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Save, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StrategyInfoCardProps } from "./types";
import { WebsiteCrawlResult } from "@/components/marketing/modules/website-crawler/types";

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
  const [previewResults, setPreviewResults] = useState<WebsiteCrawlResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
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
    setShowPreview(false);
    setPreviewResults(null);
    
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
        console.log("Crawl results:", data);
        setPreviewResults(data);
        
        // Save crawl results to the database
        const { error: saveError } = await supabase
          .from('strategy_metadata')
          .update({
            [urlType === 'websiteUrl' ? 'website_url' : 'product_url']: url,
            [urlType === 'websiteUrl' ? 'company_name' : 'product_description']: 
              data.summary || (urlType === 'websiteUrl' ? localFormValues.companyName : localFormValues.productDescription),
            additional_info: localFormValues.additionalInfo + 
              (localFormValues.additionalInfo ? '\n\n' : '') + 
              `Crawl results for ${urlType === 'websiteUrl' ? 'website' : 'product'} URL (${new Date().toLocaleString()}):\n` +
              `Keywords: ${(data.keywordsFound || []).join(', ')}\n` +
              `Technologies: ${(data.technologiesDetected || []).join(', ')}`
          })
          .eq('strategy_id', formValues.id);
        
        if (saveError) {
          console.error("Error saving crawl results:", saveError);
          toast.error("Failed to save crawl results");
        } else {
          // Update local form values with the crawl results
          setLocalFormValues(prev => ({
            ...prev,
            [urlType === 'websiteUrl' ? 'companyName' : 'productDescription']: 
              data.summary || prev[urlType === 'websiteUrl' ? 'companyName' : 'productDescription'],
            additional_info: prev.additionalInfo + 
              (prev.additionalInfo ? '\n\n' : '') + 
              `Crawl results for ${urlType === 'websiteUrl' ? 'website' : 'product'} URL (${new Date().toLocaleString()}):\n` +
              `Keywords: ${(data.keywordsFound || []).join(', ')}\n` +
              `Technologies: ${(data.technologiesDetected || []).join(', ')}`
          }));
          
          toast.success(`${urlType === 'websiteUrl' ? 'Website' : 'Product'} URL crawled successfully`);
          setShowPreview(true);
        }
      }
    } catch (err: any) {
      console.error("Error crawling website:", err);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName"
              name="companyName"
              value={localFormValues.companyName || ''}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <div className="flex gap-2">
              <Input 
                id="websiteUrl"
                name="websiteUrl"
                value={localFormValues.websiteUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleCrawl('websiteUrl')}
                disabled={crawlingUrl !== null}
                title="Crawl website for information"
              >
                {crawlingUrl === 'websiteUrl' ? (
                  <div className="animate-spin">
                    <Search className="h-4 w-4" />
                  </div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              {previewResults && crawlingUrl === null && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPreview(!showPreview)}
                  title={showPreview ? "Hide preview" : "Show preview"}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
            {crawlingUrl === 'websiteUrl' && (
              <Progress value={crawlProgress} className="h-1 mt-1" />
            )}
          </div>

          {showPreview && previewResults && (
            <div className="bg-muted/50 p-3 rounded-md text-sm mt-2 max-h-48 overflow-auto">
              <h4 className="font-medium mb-1">Website Crawl Results</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Pages crawled: {previewResults.pagesCrawled || 0} | 
                Technologies: {(previewResults.technologiesDetected || []).join(', ')}
              </p>
              <p className="text-xs">{previewResults.summary}</p>
              {previewResults.keywordsFound && previewResults.keywordsFound.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium">Keywords:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewResults.keywordsFound.map((keyword, i) => (
                      <span key={i} className="bg-primary/10 text-xs px-2 py-0.5 rounded">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="productDescription">Product Description</Label>
            <Textarea 
              id="productDescription"
              name="productDescription"
              value={localFormValues.productDescription || ''}
              onChange={handleInputChange}
              placeholder="Describe your product or service"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productUrl">Product URL</Label>
            <div className="flex gap-2">
              <Input 
                id="productUrl"
                name="productUrl"
                value={localFormValues.productUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/product"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleCrawl('productUrl')}
                disabled={crawlingUrl !== null}
                title="Crawl product page for information"
              >
                {crawlingUrl === 'productUrl' ? (
                  <div className="animate-spin">
                    <Search className="h-4 w-4" />
                  </div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            {crawlingUrl === 'productUrl' && (
              <Progress value={crawlProgress} className="h-1 mt-1" />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea 
              id="additionalInfo"
              name="additionalInfo"
              value={localFormValues.additionalInfo || ''}
              onChange={handleInputChange}
              placeholder="Any other relevant information"
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full flex items-center gap-2"
            disabled={isSaving || crawlingUrl !== null}
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Information
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StrategyInfoCard;
