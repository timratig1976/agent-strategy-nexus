
import { useState } from "react";
import { WebsiteCrawlResult, FirecrawlService } from "@/services/FirecrawlService";
import { toast } from "sonner";

export const useWebsiteCrawler = (initialData?: WebsiteCrawlResult) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<WebsiteCrawlResult | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(!!FirecrawlService.getApiKey());
  const [crawlStatus, setCrawlStatus] = useState<string>(""); // Track the crawl status

  const checkApiKey = () => {
    const apiKey = FirecrawlService.getApiKey();
    setHasApiKey(!!apiKey);
    return !!apiKey;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!url) {
      setError("Please enter a website URL");
      return;
    }
    
    if (!checkApiKey()) {
      toast.error("Please set your FireCrawl API key first");
      setError("FireCrawl API key not set");
      return;
    }
    
    // Add http:// prefix if missing
    let processedUrl = url;
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = `https://${processedUrl}`;
    }
    
    setIsLoading(true);
    setProgress(10);
    setError(null);
    setCrawlStatus("initializing");
    
    try {
      // Start a more realistic progress simulation
      let progressValue = 10;
      const progressInterval = setInterval(() => {
        // Update status message based on progress
        if (progressValue <= 20) {
          setCrawlStatus("initializing");
        } else if (progressValue <= 40) {
          setCrawlStatus("scraping");
        } else if (progressValue <= 60) {
          setCrawlStatus("processing");
        } else if (progressValue <= 90) {
          setCrawlStatus("analyzing");
        }
        
        // Increment progress, but slow down as we get higher
        setProgress(prev => {
          if (prev < 30) return prev + 5;
          if (prev < 60) return prev + 3;
          if (prev < 80) return prev + 1;
          return prev;
        });
        
        progressValue += 5;
        if (progressValue >= 90) {
          clearInterval(progressInterval);
        }
      }, 1500);
      
      // Make the direct API call
      const crawlResult = await FirecrawlService.crawlWebsite(processedUrl);
      
      clearInterval(progressInterval);
      setProgress(100);
      setCrawlStatus("completed");
      
      if (!crawlResult.success) {
        throw new Error(crawlResult.summary || "Failed to crawl website");
      }
      
      console.log("Website crawl results:", crawlResult);
      
      if (crawlResult.contentExtracted) {
        toast.success("Website crawled successfully");
      } else {
        toast.info("Website crawled, but limited content was extracted");
      }
      
      setResults(crawlResult);
    } catch (err: any) {
      console.error("Error crawling website:", err);
      setError(err.message || "Failed to crawl website");
      setCrawlStatus("failed");
      toast.error("Failed to crawl website");
    } finally {
      setIsLoading(false);
    }
  };

  const onApiKeyValidated = () => {
    setHasApiKey(true);
  };

  return {
    url,
    setUrl,
    isLoading,
    progress,
    results,
    setResults,
    error,
    handleSubmit,
    hasApiKey,
    onApiKeyValidated,
    crawlStatus
  };
};
