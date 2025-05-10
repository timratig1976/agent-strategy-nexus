
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Check, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdCampaignSettingsProps {
  campaignData: any;
  onSaveCampaign: (data: any, isFinal?: boolean) => void;
  onFinalize: () => void;
  isLoading: boolean;
}

const AdCampaignSettings: React.FC<AdCampaignSettingsProps> = ({
  campaignData,
  onSaveCampaign,
  onFinalize,
  isLoading
}) => {
  const [settings, setSettings] = useState({
    budget: campaignData?.budget || 1000,
    budgetType: campaignData?.settings?.budgetType || "daily",
    startDate: campaignData?.settings?.startDate || new Date().toISOString().split('T')[0],
    endDate: campaignData?.settings?.endDate || "",
    bidStrategy: campaignData?.settings?.bidStrategy || "lowest_cost_with_bid_cap",
    bidAmount: campaignData?.settings?.bidAmount || 1,
    adSchedule: campaignData?.settings?.adSchedule || "all_days",
    optimizationGoal: campaignData?.settings?.optimizationGoal || "conversions",
    pixelId: campaignData?.settings?.pixelId || "",
    notes: campaignData?.settings?.notes || ""
  });
  
  // Handle save settings
  const handleSave = () => {
    const updatedCampaign = {
      ...(campaignData || {}),
      budget: settings.budget,
      settings: {
        budgetType: settings.budgetType,
        startDate: settings.startDate,
        endDate: settings.endDate,
        bidStrategy: settings.bidStrategy,
        bidAmount: settings.bidAmount,
        adSchedule: settings.adSchedule,
        optimizationGoal: settings.optimizationGoal,
        pixelId: settings.pixelId,
        notes: settings.notes
      },
      lastUpdated: new Date().toISOString()
    };
    
    onSaveCampaign(updatedCampaign);
  };
  
  // Handle finalize campaign
  const handleFinalize = () => {
    // Check for required components
    const adSetsCount = campaignData?.adSets?.length || 0;
    const targetAudiencesCount = campaignData?.targetAudiences?.length || 0;
    const adCreativesCount = campaignData?.adCreatives?.length || 0;
    
    if (adSetsCount === 0) {
      toast.error("Please create at least one ad set before finalizing");
      return;
    }
    
    if (targetAudiencesCount === 0) {
      toast.error("Please create at least one target audience before finalizing");
      return;
    }
    
    if (adCreativesCount === 0) {
      toast.error("Please create at least one ad creative before finalizing");
      return;
    }
    
    // Save settings first
    handleSave();
    
    // Then finalize
    onFinalize();
  };
  
  // Handle settings changes
  const handleChange = (field: string, value: string | number) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading campaign settings...</span>
      </div>
    );
  }
  
  // Calculate completeness
  const adSetsCount = campaignData?.adSets?.length || 0;
  const targetAudiencesCount = campaignData?.targetAudiences?.length || 0;
  const adCreativesCount = campaignData?.adCreatives?.length || 0;
  const landingPagesCount = campaignData?.landingPages?.length || 0;
  
  const completedSteps = [
    adSetsCount > 0,
    targetAudiencesCount > 0,
    adCreativesCount > 0,
    settings.startDate,
    settings.budget > 0
  ];
  
  const completeness = Math.round((completedSteps.filter(Boolean).length / completedSteps.length) * 100);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Campaign Settings</h3>
        <div className="space-x-2">
          <Button 
            onClick={handleSave}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
          <Button 
            onClick={handleFinalize}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Finalize Campaign
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  completeness < 50 ? 'bg-red-500' : 
                  completeness < 80 ? 'bg-amber-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              Campaign completeness: <span className="font-medium">{completeness}%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${adSetsCount > 0 ? 'bg-green-500' : 'bg-slate-300'}`}>
                  {adSetsCount > 0 && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="ml-2">
                  Ad Sets: <span className="font-medium">{adSetsCount}</span>
                </span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${targetAudiencesCount > 0 ? 'bg-green-500' : 'bg-slate-300'}`}>
                  {targetAudiencesCount > 0 && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="ml-2">
                  Target Audiences: <span className="font-medium">{targetAudiencesCount}</span>
                </span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${adCreativesCount > 0 ? 'bg-green-500' : 'bg-slate-300'}`}>
                  {adCreativesCount > 0 && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="ml-2">
                  Ad Creatives: <span className="font-medium">{adCreativesCount}</span>
                </span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${landingPagesCount > 0 ? 'bg-green-500' : 'bg-slate-300'}`}>
                  {landingPagesCount > 0 && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="ml-2">
                  Landing Pages: <span className="font-medium">{landingPagesCount}</span>
                </span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${settings.startDate ? 'bg-green-500' : 'bg-slate-300'}`}>
                  {settings.startDate && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="ml-2">
                  Campaign Dates
                </span>
              </div>
              
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${settings.budget > 0 ? 'bg-green-500' : 'bg-slate-300'}`}>
                  {settings.budget > 0 && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="ml-2">
                  Budget
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Budget & Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Campaign Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                value={settings.budget}
                onChange={(e) => handleChange('budget', Number(e.target.value))}
                placeholder="Enter campaign budget"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget-type">Budget Type</Label>
              <Select 
                value={settings.budgetType}
                onValueChange={(value) => handleChange('budgetType', value)}
              >
                <SelectTrigger id="budget-type">
                  <SelectValue placeholder="Select budget type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Budget</SelectItem>
                  <SelectItem value="lifetime">Lifetime Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={settings.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date (Optional)</Label>
              <Input
                id="end-date"
                type="date"
                value={settings.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bid-strategy">Bid Strategy</Label>
              <Select 
                value={settings.bidStrategy}
                onValueChange={(value) => handleChange('bidStrategy', value)}
              >
                <SelectTrigger id="bid-strategy">
                  <SelectValue placeholder="Select bid strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lowest_cost_with_bid_cap">Lowest Cost with Bid Cap</SelectItem>
                  <SelectItem value="lowest_cost">Lowest Cost</SelectItem>
                  <SelectItem value="cost_cap">Cost Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bid-amount">Bid Cap/Cost Cap Amount ($)</Label>
              <Input
                id="bid-amount"
                type="number"
                value={settings.bidAmount}
                onChange={(e) => handleChange('bidAmount', Number(e.target.value))}
                placeholder="Enter bid amount"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Optimization & Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="optimization-goal">Optimization Goal</Label>
              <Select 
                value={settings.optimizationGoal}
                onValueChange={(value) => handleChange('optimizationGoal', value)}
              >
                <SelectTrigger id="optimization-goal">
                  <SelectValue placeholder="Select optimization goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversions">Conversions</SelectItem>
                  <SelectItem value="link_clicks">Link Clicks</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="reach">Reach</SelectItem>
                  <SelectItem value="landing_page_views">Landing Page Views</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ad-schedule">Ad Schedule</Label>
              <Select 
                value={settings.adSchedule}
                onValueChange={(value) => handleChange('adSchedule', value)}
              >
                <SelectTrigger id="ad-schedule">
                  <SelectValue placeholder="Select ad schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_days">Run ads all days</SelectItem>
                  <SelectItem value="weekdays_only">Weekdays only</SelectItem>
                  <SelectItem value="weekends_only">Weekends only</SelectItem>
                  <SelectItem value="custom">Custom schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pixel-id">Meta Pixel ID (Optional)</Label>
            <Input
              id="pixel-id"
              value={settings.pixelId}
              onChange={(e) => handleChange('pixelId', e.target.value)}
              placeholder="Enter Meta Pixel ID for conversion tracking"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={settings.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Enter additional notes or instructions for this campaign"
            />
          </div>
        </CardContent>
      </Card>
      
      <Alert className="bg-purple-50 border-purple-200">
        <AlertDescription className="text-purple-800">
          <p>
            Note: This campaign setup is for planning purposes. To launch the actual Meta Ads campaign, you'll need to use the Meta Ads Manager with your account. You can export these settings from the "Finalize Campaign" process.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdCampaignSettings;
