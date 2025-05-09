import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { WebsiteCrawlResult } from "@/services/firecrawl";

interface WebsiteCrawlerResultsProps {
  results: WebsiteCrawlResult;
}

const WebsiteCrawlerResults = ({ results }: WebsiteCrawlerResultsProps) => {
  const [adoptedContent, setAdoptedContent] = useState<string[]>([]);

  // Extract keywords from crawl data
  const keywordsFound = results.keywordsFound || [];

  // Use summary from results
  const summary = results.summary || "No content was extracted from the website.";

  // Extract technologiesDetected or create empty array
  const technologiesDetected = results.technologiesDetected || [];

  // Calculate pagesCrawled from data
  const pagesCrawled = results.pagesCrawled || 0;

  // Check if we have content
  const hasContent = results.contentExtracted && results.data && results.data.length > 0;

  // For error handling
  const hasError = results.error || !results.success;

  const handleAdoptContent = (content: string) => {
    setAdoptedContent((prev) => [...prev, content]);
    
    // Copy to clipboard
    navigator.clipboard.writeText(content).then(
      () => {
        toast.success("Content copied to clipboard and saved for reference.");
      },
      () => {
        toast.error("Content was saved but could not be copied to clipboard.");
      }
    );
  };

  const isAdopted = (content: string) => adoptedContent.includes(content);

  return (
    <div className="space-y-6 mt-6">
      <h3 className="text-lg font-semibold">Crawl Results</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {hasError && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md flex items-start space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Error Occurred</p>
                  <p className="text-sm mt-1">{results.error || "An error occurred during the crawl process."}</p>
                </div>
              </div>
            )}
            
            {!hasContent && !hasError && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-md flex items-start space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">No Content Extracted</p>
                  <p className="text-sm mt-1">
                    The website may be protected against crawling or require JavaScript rendering.
                    Try increasing the timeout or using a different URL.
                  </p>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground mb-2">{summary}</p>
              {!isAdopted(summary) ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAdoptContent(summary)}
                >
                  Adopt Content
                </Button>
              ) : (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" /> Content Adopted
                </Badge>
              )}
            </div>
            
            {keywordsFound.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Keywords Found</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {keywordsFound.map((keyword, index) => (
                    <Badge key={index} variant="secondary">{keyword}</Badge>
                  ))}
                </div>
                {!isAdopted(keywordsFound.join(", ")) ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAdoptContent(keywordsFound.join(", "))}
                  >
                    Adopt Keywords
                  </Button>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" /> Keywords Adopted
                  </Badge>
                )}
              </div>
            )}
            
            {technologiesDetected.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Technologies Detected</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {technologiesDetected.map((tech, index) => (
                    <Badge key={index} variant="outline">{tech}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium">Statistics</h4>
              <ul className="mt-2 text-sm">
                <li className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-muted-foreground">Pages Crawled:</span>
                  <span className="font-medium">{pagesCrawled}</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge 
                    variant={results.success ? "secondary" : "outline"} 
                    className={results.success ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}
                  >
                    {results.success ? "Success" : "Error"}
                  </Badge>
                </li>
              </ul>
            </div>

            {results.url && (
              <div>
                <h4 className="text-sm font-medium mb-1">Crawl Details</h4>
                <p className="text-xs text-muted-foreground break-all">ID: {results.id || 'N/A'}</p>
                <p className="text-xs text-muted-foreground break-all flex items-center">
                  URL: {results.url}
                  <a 
                    href={results.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center text-primary hover:text-primary/80"
                  >
                    <ExternalLink size={12} />
                  </a>
                </p>
                {results.id && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <a 
                      href={`https://api.firecrawl.dev/v1/crawl/${results.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 inline-flex items-center"
                    >
                      View API Result <ExternalLink size={12} className="ml-1" />
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-6">
          <div className="w-full">
            {adoptedContent.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Adopted Content</h4>
                <div className="space-y-2">
                  {adoptedContent.map((content, index) => (
                    <div key={index} className="text-xs text-muted-foreground bg-muted p-2 rounded overflow-auto max-h-60">
                      {content.length > 100 ? `${content.substring(0, 100)}...` : content}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WebsiteCrawlerResults;
