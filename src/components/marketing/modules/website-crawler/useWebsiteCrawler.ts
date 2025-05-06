
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
    
    setIsLoading(true);
    setProgress(10);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('website-crawler', {
        body: { url }
      });
      
      setProgress(100);
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data) {
        setResults(data);
        toast.success("Website crawled successfully");
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
