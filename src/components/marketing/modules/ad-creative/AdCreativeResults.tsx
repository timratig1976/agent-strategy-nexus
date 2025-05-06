
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdCreative } from "./types";
import { Copy, Download, Facebook, Linkedin, MessageCircle, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AdCreativeResultsProps {
  result: AdCreative;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

const AdCreativeResults = ({
  result,
  onSave,
  onReset,
  isSaving,
}: AdCreativeResultsProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied!",
          description: "Text copied to clipboard",
        });
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  // Helper to get platform icon
  const getPlatformIcon = () => {
    switch (result.platform) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "twitter":
        return <MessageCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getPlatformIcon()}
                  Ad Preview
                </CardTitle>
                <Badge variant="outline">{result.adType}</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {result.imageUrl && (
                <div className="relative">
                  <img
                    src={result.imageUrl}
                    alt="Ad creative visual"
                    className="w-full h-auto aspect-square object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-bold text-lg">{result.headline}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {result.primaryText}
                </p>
                <div className="mt-4">
                  <Badge variant="secondary" className="font-semibold">
                    {result.callToAction}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ad Copy Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Headline</h3>
                <div className="p-3 bg-muted rounded-md flex justify-between items-start">
                  <p className="text-sm">{result.headline}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.headline)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Primary Text</h3>
                <div className="p-3 bg-muted rounded-md flex justify-between items-start">
                  <p className="text-sm whitespace-pre-wrap">{result.primaryText}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.primaryText)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {result.description && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <div className="p-3 bg-muted rounded-md flex justify-between items-start">
                    <p className="text-sm">{result.description}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.description)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-1">Call to Action</h3>
                <div className="p-3 bg-muted rounded-md flex justify-between items-start">
                  <p className="text-sm">{result.callToAction}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.callToAction)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {result.target && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Target Audience</h3>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{result.target}</p>
                  </div>
                </div>
              )}
              
              {result.imageUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Image</h3>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate max-w-[70%]">Generated Image</span>
                      <a href={result.imageUrl} download="ad_creative.jpg" target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={onReset}>
                Create New Ad
              </Button>
              <Button onClick={onSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Ad"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdCreativeResults;
