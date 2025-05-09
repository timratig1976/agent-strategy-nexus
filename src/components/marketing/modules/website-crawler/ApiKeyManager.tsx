
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FirecrawlService } from "@/services/firecrawl";

interface ApiKeyManagerProps {
  onApiKeyValidated?: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyValidated }) => {
  const [apiKey, setApiKey] = useState("");
  const [hasValidKey, setHasValidKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Check if we already have a stored API key on component mount
  useEffect(() => {
    const storedKey = FirecrawlService.getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      setHasValidKey(true);
    }
  }, []);

  const handleValidateKey = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    
    // Check if the API key has the correct format
    if (!apiKey.startsWith('fc-')) {
      toast.error("Invalid API key format. Firecrawl API keys start with 'fc-'");
      return;
    }

    setIsValidating(true);
    try {
      console.log("Validating API key:", apiKey.substring(0, 5) + "...");
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        console.log("API key validation successful");
        FirecrawlService.saveApiKey(apiKey);
        setHasValidKey(true);
        toast.success("API key validated and saved successfully");
        
        // Notify parent component if callback provided
        if (onApiKeyValidated) {
          onApiKeyValidated();
        }
      } else {
        console.log("API key validation failed");
        toast.error("Invalid API key. Please check and try again.");
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      toast.error("Failed to validate API key. Please check your internet connection.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearKey = () => {
    FirecrawlService.clearApiKey();
    setApiKey("");
    setHasValidKey(false);
    toast.info("API key cleared");
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter your Firecrawl API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-grow"
        />
        {!hasValidKey ? (
          <Button 
            onClick={handleValidateKey} 
            disabled={isValidating || !apiKey.trim()}
          >
            {isValidating ? "Validating..." : "Save Key"}
          </Button>
        ) : (
          <Button variant="outline" onClick={handleClearKey}>
            Clear Key
          </Button>
        )}
      </div>
      
      {hasValidKey && (
        <p className="text-sm text-green-600">
          ✓ Valid API key is set
        </p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Get your Firecrawl API key from <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="underline">Firecrawl.dev</a>. 
        Firecrawl API keys start with 'fc-'.
      </p>
    </div>
  );
};

export default ApiKeyManager;
