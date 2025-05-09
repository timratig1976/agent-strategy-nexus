
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FirecrawlService } from "@/services/firecrawl";
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyManagerProps {
  onApiKeyValidated?: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyValidated }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [hasExistingKey, setHasExistingKey] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Check for existing API key on component mount
  useEffect(() => {
    const existingKey = FirecrawlService.getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
      setHasExistingKey(true);
      setIsValidated(true);
    }
  }, []);

  const validateApiKeyFormat = (key: string): boolean => {
    // Check if key starts with 'fc-' and is at least 10 characters
    return key.startsWith('fc-') && key.length >= 10;
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationError("API key cannot be empty");
      return;
    }

    if (!validateApiKeyFormat(apiKey)) {
      setValidationError("Invalid API key format. It should start with 'fc-'");
      return;
    }

    setValidationError(null);
    setIsSaving(true);

    try {
      const isValid = await FirecrawlService.testApiKey(apiKey);
      
      if (isValid) {
        FirecrawlService.saveApiKey(apiKey);
        setIsValidated(true);
        setHasExistingKey(true);
        toast.success("API key saved and validated successfully");
        
        // Call the callback if provided
        if (onApiKeyValidated) {
          onApiKeyValidated();
        }
      } else {
        setValidationError("API key validation failed. Please check your key and try again.");
        toast.error("API key validation failed");
      }
    } catch (error) {
      console.error("API key validation error:", error);
      setValidationError("Error validating API key. Please try again.");
      toast.error("Error validating API key");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearApiKey = () => {
    setApiKey("");
    setIsValidated(false);
    setHasExistingKey(false);
    FirecrawlService.clearApiKey();
    toast.success("API key removed");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Firecrawl API key"
          className="flex-1"
          disabled={isSaving}
        />
        <Button 
          onClick={handleSaveApiKey} 
          disabled={isSaving || (isValidated && apiKey === FirecrawlService.getApiKey())}
          variant="outline"
        >
          {isSaving ? "Validating..." : hasExistingKey ? "Update" : "Save"}
        </Button>
        {hasExistingKey && (
          <Button 
            onClick={handleClearApiKey}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            Clear
          </Button>
        )}
      </div>
      
      {validationError && (
        <div className="text-sm text-destructive flex items-center gap-1 mt-1">
          <AlertCircle className="h-4 w-4" />
          <span>{validationError}</span>
        </div>
      )}
      
      {isValidated && !validationError && (
        <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
          <CheckCircle className="h-4 w-4" />
          <span>API key validated successfully</span>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-1">
        Need a Firecrawl API key? Sign up at <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firecrawl.dev</a>
      </p>
    </div>
  );
};

export default ApiKeyManager;
