import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FirecrawlService } from "@/services/firecrawl";

interface ApiKeyManagerProps {
  onApiKeyValidated?: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyValidated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Check if API key exists on mount
  useEffect(() => {
    const existingKey = FirecrawlService.getApiKey();
    setHasApiKey(!!existingKey);
  }, []);
  
  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    setIsTesting(true);
    
    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setHasApiKey(true);
        toast.success("API key validated and saved successfully");
        setIsOpen(false);
        if (onApiKeyValidated) onApiKeyValidated();
      } else {
        toast.error("Invalid API key. Please check and try again.");
      }
    } catch (error) {
      console.error("Error testing API key:", error);
      toast.error("Failed to validate API key");
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <>
      <Button 
        variant={hasApiKey ? "outline" : "default"} 
        size="sm"
        onClick={() => setIsOpen(true)}
        className="mb-4"
      >
        {hasApiKey ? "Update FireCrawl API Key" : "Set FireCrawl API Key"}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{hasApiKey ? "Update" : "Set"} FireCrawl API Key</DialogTitle>
            <DialogDescription>
              Enter your FireCrawl API key to enable website crawling functionality.
              {!hasApiKey && " You'll need this key to analyze websites."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your FireCrawl API key"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is stored securely in your browser's local storage.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveApiKey} disabled={isTesting}>
              {isTesting ? "Testing..." : "Save API Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeyManager;
