
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { WebsiteCrawlResult } from "./types";

interface WebsiteCrawlerResultsProps {
  results: WebsiteCrawlResult;
}

const WebsiteCrawlerResults = ({ results }: WebsiteCrawlerResultsProps) => {
  const [adoptedContent, setAdoptedContent] = useState<string[]>([]);

  // Extract keywords from crawl data
  const keywordsFound = results.keywordsFound || 
    (results.data?.flatMap(item => item.metadata?.keywords?.split(',') || []) || [])
      .map(word => word.trim())
      .filter(word => word.length > 0);

  // Generate a summary from the crawl data
  const summary = results.summary || 
    results.data?.[0]?.content?.substring(0, 200) + "..." || 
    "Content extracted from website. Review the data for insights about the company and its products.";

  // Extract technologiesDetected or create empty array
  const technologiesDetected = results.technologiesDetected || [];

  // Calculate pagesCrawled from data
  const pagesCrawled = results.pagesCrawled || results.data?.length || 0;

  // Determine if content was successfully extracted
  const contentExtracted = results.contentExtracted !== undefined ? 
    results.contentExtracted : (results.data && results.data.length > 0);

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
                  <span className="text-muted-foreground">Content Extraction:</span>
                  <span className="font-medium">
                    {contentExtracted ? "Successful" : "Failed"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 pb-6">
          <div className="w-full">
            {adoptedContent.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Adopted Content</h4>
                <div className="space-y-2">
                  {adoptedContent.map((content, index) => (
                    <div key={index} className="text-xs text-muted-foreground bg-muted p-2 rounded">
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
