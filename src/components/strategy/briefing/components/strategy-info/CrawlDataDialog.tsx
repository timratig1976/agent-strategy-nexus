
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WebsiteCrawlResult } from "@/services/firecrawl";
import { Eye } from "lucide-react";

interface CrawlDataDialogProps {
  crawlResult: WebsiteCrawlResult | null;
  title?: string;
}

const CrawlDataDialog: React.FC<CrawlDataDialogProps> = ({ 
  crawlResult, 
  title = "Website Crawl Data"
}) => {
  if (!crawlResult || !crawlResult.data || crawlResult.data.length === 0) {
    return null;
  }

  const markdownContent = crawlResult.data[0].markdown || "No markdown content available";
  
  const metadata = crawlResult.data[0].metadata 
    ? crawlResult.data[0].metadata 
    : {};

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs flex gap-1 items-center mt-1">
          <Eye className="h-3.5 w-3.5" /> View Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="markdown" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="markdown">Markdown Content</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>
          
          <TabsContent value="markdown" className="border rounded-md p-4">
            <ScrollArea className="h-[400px]">
              <div className="whitespace-pre-wrap font-mono text-xs">
                {markdownContent}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="metadata" className="border rounded-md p-4">
            <ScrollArea className="h-[400px]">
              <div className="font-mono text-xs whitespace-pre-wrap">
                {Object.keys(metadata).length > 0 ? (
                  <pre>{JSON.stringify(metadata, null, 2)}</pre>
                ) : (
                  <p>No metadata available</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="keywords" className="border rounded-md p-4">
            <ScrollArea className="h-[400px]">
              {crawlResult.keywordsFound && crawlResult.keywordsFound.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {crawlResult.keywordsFound.map((keyword, index) => (
                    <div key={index} className="bg-muted px-2 py-1 rounded text-sm">
                      {keyword}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No keywords found</p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="text-xs text-muted-foreground mt-2">
          <p>Pages Crawled: {crawlResult.pagesCrawled}</p>
          <p>URL: {crawlResult.url}</p>
          <p>Status: {crawlResult.status || "completed"}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrawlDataDialog;
