
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Globe, Loader2, Settings } from "lucide-react";
import ApiKeyManager from "./ApiKeyManager";
import { useNavigate } from "react-router-dom";
import { FirecrawlService } from "@/services/firecrawl";

interface WebsiteAnalysisFormProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  progress: number;
  error: string | null;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  hasApiKey: boolean;
  onApiKeyValidated: () => void;
  crawlStatus?: string;
}

const WebsiteAnalysisForm: React.FC<WebsiteAnalysisFormProps> = ({
  url,
  setUrl,
  isLoading,
  progress,
  error,
  handleSubmit,
  hasApiKey,
  onApiKeyValidated,
  crawlStatus
}) => {
  const [showApiKeyForm, setShowApiKeyForm] = useState(!hasApiKey);
  const navigate = useNavigate();

  // Return human-readable status message
  const getStatusMessage = (status: string | undefined) => {
    switch (status) {
      case "initializing":
        return "Initializing crawl...";
      case "scraping":
        return "Scraping website content...";
      case "processing":
        return "Processing data...";
      case "analyzing":
        return "Analyzing website structure...";
      case "completed":
        return "Crawl completed!";
      case "failed":
        return "Crawl failed";
      case "timeout":
        return "Crawl taking longer than expected";
      default:
        return "Preparing to crawl...";
    }
  };

  const goToSettings = () => {
    navigate('/settings');
  };
  
  const checkApiKey = () => {
    const apiKey = FirecrawlService.getApiKey();
    return !!apiKey;
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        {showApiKeyForm ? (
          <div className="space-y-4">
            <div className="mb-4">
              <ApiKeyManager onApiKeyValidated={() => {
                setShowApiKeyForm(false);
                onApiKeyValidated();
              }} />
            </div>
            {/* Temporary inline ApiKeyManager with option to go to settings */}
            <div className="flex justify-between items-center border-t pt-4">
              <p className="text-sm">
                For permanent API key management, use the Settings page.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowApiKeyForm(false);
                  if (checkApiKey()) {
                    onApiKeyValidated();
                  }
                }}
              >
                {checkApiKey() ? "Continue with saved key" : "Skip for now"}
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={goToSettings}
                className="flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                Go to Settings
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Website URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !url}
                  className={isLoading ? "animate-pulse" : ""}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Globe className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Crawling..." : "Analyze Website"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter the full URL of the website you want to analyze (including http:// or https://)
              </p>
            </div>

            {isLoading && (
              <div className="space-y-2">
                <div className="text-sm">
                  {getStatusMessage(crawlStatus)}
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div className="text-sm">{error}</div>
              </div>
            )}

            <div className="flex justify-between">
              {!hasApiKey ? (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowApiKeyForm(true)}
                >
                  Set FireCrawl API Key
                </Button>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={goToSettings}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Manage API Keys
                </Button>
              )}
              
              {hasApiKey && (
                <div className="text-sm text-muted-foreground">
                  API key set ✓
                </div>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default WebsiteAnalysisForm;
