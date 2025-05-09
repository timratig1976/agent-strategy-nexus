
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ApiKeyManager from "@/components/marketing/modules/website-crawler/ApiKeyManager";

const APIKeysTab: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>API Keys Configuration</CardTitle>
        <CardDescription>
          Manage API keys for external services.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Firecrawl API</h3>
          <p className="text-sm text-muted-foreground">
            Configure your Firecrawl API key for website crawling and analysis.
          </p>
          <ApiKeyManager />
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeysTab;
