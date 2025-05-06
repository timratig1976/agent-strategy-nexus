
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CrawlerResults {
  pagesCrawled: number;
  contentExtracted: boolean;
  summary: string;
  keywordsFound: string[];
  technologiesDetected: string[];
}

export const useWebsiteCrawler = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<CrawlerResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // Simulate completion after full progress
        setTimeout(() => {
          setResults({
            pagesCrawled: 8,
            contentExtracted: true,
            summary: "Website analysis complete. Found information about your products, services, and company background. Key pages include homepage, about, services, and contact pages.",
            keywordsFound: ["marketing", "digital", "services", "agency", "solutions"],
            technologiesDetected: ["WordPress", "Google Analytics", "Facebook Pixel"]
          });
          setIsLoading(false);
          toast({
            title: "Website crawling complete",
            description: "We've analyzed your website and extracted relevant information",
          });
        }, 500);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Validate URL
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;
      if (!urlPattern.test(url)) {
        throw new Error("Please enter a valid website URL");
      }
      
      // In a real implementation, we'd call a backend service to crawl the website
      // For now, we'll simulate the crawling process
      simulateProgress();
      
    } catch (error) {
      console.error("Error crawling website:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsLoading(false);
      toast({
        title: "Crawling failed",
        description: error instanceof Error ? error.message : "Failed to analyze website",
        variant: "destructive",
      });
    }
  };

  return {
    url,
    setUrl,
    isLoading,
    progress,
    results,
    error,
    handleSubmit
  };
};
