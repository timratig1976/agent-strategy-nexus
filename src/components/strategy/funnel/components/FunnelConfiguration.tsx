
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface FunnelConfigurationProps {
  funnelData: any;
  onSaveFunnel: (data: any, isFinal?: boolean) => void;
  isLoading: boolean;
}

const FunnelConfiguration: React.FC<FunnelConfigurationProps> = ({
  funnelData,
  onSaveFunnel,
  isLoading
}) => {
  const initialConfig = {
    name: funnelData?.name || "Marketing Funnel Strategy",
    primaryGoal: funnelData?.primaryGoal || "Increase conversions",
    leadMagnetType: funnelData?.leadMagnetType || "ebook",
    targetAudience: funnelData?.targetAudience || "",
    mainChannel: funnelData?.mainChannel || "social_media",
    conversionAction: funnelData?.conversionAction || "purchase",
    timeframe: funnelData?.timeframe || "90 days",
    budget: funnelData?.budget || "5000",
    kpis: funnelData?.kpis || "Conversion rate, Cost per acquisition, Return on ad spend",
    notes: funnelData?.notes || ""
  };
  
  const [config, setConfig] = useState(initialConfig);
  
  const handleChange = (field: string, value: string) => {
    setConfig({
      ...config,
      [field]: value
    });
  };
  
  const handleSave = () => {
    const updatedFunnel = {
      ...(funnelData || {}),
      ...config,
      lastUpdated: new Date().toISOString()
    };
    onSaveFunnel(updatedFunnel);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading funnel configuration...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Funnel Configuration</h3>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="funnel-name">Funnel Name</Label>
              <Input
                id="funnel-name"
                value={config.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter funnel name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="primary-goal">Primary Goal</Label>
              <Input
                id="primary-goal"
                value={config.primaryGoal}
                onChange={(e) => handleChange('primaryGoal', e.target.value)}
                placeholder="What is the main goal of this funnel?"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target-audience">Target Audience</Label>
            <Textarea
              id="target-audience"
              value={config.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              placeholder="Describe your target audience for this funnel"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Strategy Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="main-channel">Primary Marketing Channel</Label>
              <Select 
                value={config.mainChannel}
                onValueChange={(value) => handleChange('mainChannel', value)}
              >
                <SelectTrigger id="main-channel">
                  <SelectValue placeholder="Select primary channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="email">Email Marketing</SelectItem>
                  <SelectItem value="content">Content Marketing</SelectItem>
                  <SelectItem value="seo">SEO</SelectItem>
                  <SelectItem value="paid_ads">Paid Advertising</SelectItem>
                  <SelectItem value="events">Events & Webinars</SelectItem>
                  <SelectItem value="direct">Direct Outreach</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lead-magnet">Lead Magnet Type</Label>
              <Select 
                value={config.leadMagnetType}
                onValueChange={(value) => handleChange('leadMagnetType', value)}
              >
                <SelectTrigger id="lead-magnet">
                  <SelectValue placeholder="Select lead magnet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ebook">E-book / Guide</SelectItem>
                  <SelectItem value="webinar">Webinar / Workshop</SelectItem>
                  <SelectItem value="template">Template / Tool</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                  <SelectItem value="case_study">Case Study</SelectItem>
                  <SelectItem value="free_trial">Free Trial</SelectItem>
                  <SelectItem value="consultation">Free Consultation</SelectItem>
                  <SelectItem value="discount">Discount / Coupon</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conversion-action">Conversion Action</Label>
              <Select 
                value={config.conversionAction}
                onValueChange={(value) => handleChange('conversionAction', value)}
              >
                <SelectTrigger id="conversion-action">
                  <SelectValue placeholder="Select conversion action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="signup">Sign Up</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="consultation">Book Consultation</SelectItem>
                  <SelectItem value="demo">Request Demo</SelectItem>
                  <SelectItem value="download">Download</SelectItem>
                  <SelectItem value="contact">Contact Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Implementation Timeframe</Label>
              <Select 
                value={config.timeframe}
                onValueChange={(value) => handleChange('timeframe', value)}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 days">30 days</SelectItem>
                  <SelectItem value="60 days">60 days</SelectItem>
                  <SelectItem value="90 days">90 days</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="12 months">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (USD)</Label>
            <Input
              id="budget"
              type="number"
              value={config.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
              placeholder="Estimated budget"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kpis">Key Performance Indicators (KPIs)</Label>
            <Textarea
              id="kpis"
              value={config.kpis}
              onChange={(e) => handleChange('kpis', e.target.value)}
              placeholder="List key metrics for measuring success"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={config.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional information about your funnel strategy"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelConfiguration;
