
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { StrategyInfoCardProps } from "./types";

const StrategyInfoCard: React.FC<StrategyInfoCardProps> = ({
  formValues,
  saveStrategyMetadata,
  showCrawler,
  setShowCrawler
}) => {
  const [localFormValues, setLocalFormValues] = useState(formValues);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update local form values when formValues prop changes
  useEffect(() => {
    setLocalFormValues(formValues);
  }, [formValues]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveStrategyMetadata(localFormValues);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Strategy Information</span>
          {!showCrawler && localFormValues.websiteUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowCrawler(true)}
              className="flex items-center gap-1"
            >
              <Globe className="h-4 w-4" />
              <span>Crawl Website</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName"
              name="companyName"
              value={localFormValues.companyName || ''}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input 
              id="websiteUrl"
              name="websiteUrl"
              value={localFormValues.websiteUrl || ''}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productDescription">Product Description</Label>
            <Textarea 
              id="productDescription"
              name="productDescription"
              value={localFormValues.productDescription || ''}
              onChange={handleInputChange}
              placeholder="Describe your product or service"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productUrl">Product URL</Label>
            <Input 
              id="productUrl"
              name="productUrl"
              value={localFormValues.productUrl || ''}
              onChange={handleInputChange}
              placeholder="https://example.com/product"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea 
              id="additionalInfo"
              name="additionalInfo"
              value={localFormValues.additionalInfo || ''}
              onChange={handleInputChange}
              placeholder="Any other relevant information"
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full flex items-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Information
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StrategyInfoCard;
