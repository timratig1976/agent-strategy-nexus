
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WebsiteAnalysisFormProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  progress: number;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

const WebsiteAnalysisForm: React.FC<WebsiteAnalysisFormProps> = ({
  url,
  setUrl,
  isLoading,
  progress,
  error,
  handleSubmit
}) => {
  return (
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
            <p className="text-xs text-muted-foreground">
              Enter a website URL (e.g., example.com or https://example.com)
            </p>
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
  );
};

export default WebsiteAnalysisForm;
