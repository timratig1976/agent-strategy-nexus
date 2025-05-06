
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Spider, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const WebsiteCrawlingModule = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Spider className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Website Crawling</h2>
          <p className="text-muted-foreground mt-1">
            Analyze your website content to inform your marketing strategy
          </p>
        </div>
      </div>

      <Card className="mb-8">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Website Analysis</CardTitle>
            <CardDescription>
              Enter your website URL to analyze its content and structure
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="website-url"
                  placeholder="https://yourwebsite.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !url}>
                  {isLoading ? "Analyzing..." : "Analyze"}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Analyzing website...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </form>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Summary of content extracted from your website
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Summary</h3>
              <p className="text-sm text-muted-foreground">{results.summary}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded">
                  <div className="text-sm text-muted-foreground">Pages Crawled</div>
                  <div className="text-2xl font-semibold">{results.pagesCrawled}</div>
                </div>
                <div className="bg-muted p-3 rounded">
                  <div className="text-sm text-muted-foreground">Technologies</div>
                  <div className="text-2xl font-semibold">{results.technologiesDetected.length}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Keywords Found</h3>
              <div className="flex flex-wrap gap-2">
                {results.keywordsFound.map((keyword: string, index: number) => (
                  <div key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                    {keyword}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Technologies Detected</h3>
              <div className="flex flex-wrap gap-2">
                {results.technologiesDetected.map((tech: string, index: number) => (
                  <div key={index} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button variant="outline" className="w-full">
              Download Full Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default WebsiteCrawlingModule;
