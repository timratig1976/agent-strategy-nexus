
import React from "react";
import { Globe } from "lucide-react";
import WebsiteAnalysisForm from "./WebsiteAnalysisForm";
import WebsiteCrawlerResults from "./WebsiteCrawlerResults";
import { useWebsiteCrawler } from "./useWebsiteCrawler";
import { WebsiteCrawlResult } from "@/services/FirecrawlService";

interface WebsiteCrawlingModuleProps {
  initialData?: WebsiteCrawlResult;
  onResults?: React.Dispatch<React.SetStateAction<WebsiteCrawlResult | undefined>>;
}

const WebsiteCrawlingModule: React.FC<WebsiteCrawlingModuleProps> = ({ 
  initialData,
  onResults 
}) => {
  const { 
    url, 
    setUrl, 
    isLoading, 
    progress, 
    results: internalResults, 
    setResults: setInternalResults,
    error,
    handleSubmit,
    hasApiKey,
    onApiKeyValidated
  } = useWebsiteCrawler(initialData);

  // Update parent component when results change
  React.useEffect(() => {
    if (internalResults && onResults) {
      onResults(internalResults);
    }
  }, [internalResults, onResults]);

  const results = internalResults || initialData;

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
        hasApiKey={hasApiKey}
        onApiKeyValidated={onApiKeyValidated}
      />

      {results && <WebsiteCrawlerResults results={results} />}
    </div>
  );
};

export default WebsiteCrawlingModule;
