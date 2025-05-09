
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteCrawlResult } from "./types";
import { toast } from "sonner";

export const useWebsiteCrawler = (initialData?: WebsiteCrawlResult) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<WebsiteCrawlResult | null>(initialData || null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!url) {
      setError("Please enter a website URL");
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
    
    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress < 90 ? newProgress : prev;
        });
      }, 1000);
      
      const { data, error } = await supabase.functions.invoke('website-crawler', {
        body: { url: processedUrl }
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        console.log("Website crawl results:", data);
        
        if (data.contentExtracted) {
          toast.success("Website crawled successfully");
        } else {
          toast.info("Website crawled, but limited content was extracted");
        }
        
        setResults(data);
      }
    } catch (err: any) {
      console.error("Error crawling website:", err);
      setError(err.message || "Failed to crawl website");
      toast.error("Failed to crawl website");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    url,
    setUrl,
    isLoading,
    progress,
    results,
    setResults,
    error,
    handleSubmit
  };
};
