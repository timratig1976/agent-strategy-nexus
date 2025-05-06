
import React from "react";
import { Globe } from "lucide-react";
import WebsiteAnalysisForm from "./WebsiteAnalysisForm";
import WebsiteCrawlerResults from "./WebsiteCrawlerResults";
import { useWebsiteCrawler } from "./useWebsiteCrawler";

const WebsiteCrawlingModule = () => {
  const { 
    url, 
    setUrl, 
    isLoading, 
    progress, 
    results, 
    error, 
    handleSubmit 
  } = useWebsiteCrawler();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Globe className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Website Crawling</h2>
          <p className="text-muted-foreground mt-1">
            Analyze your website content to inform your marketing strategy
          </p>
        </div>
      </div>

      <WebsiteAnalysisForm 
        url={url}
        setUrl={setUrl}
        isLoading={isLoading}
        progress={progress}
        error={error}
        handleSubmit={handleSubmit}
      />

      {results && <WebsiteCrawlerResults results={results} />}
    </div>
  );
};

export default WebsiteCrawlingModule;
