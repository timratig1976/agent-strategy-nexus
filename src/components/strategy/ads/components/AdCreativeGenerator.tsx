
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface AdCreativeGeneratorProps {
  campaignData: any;
  onSaveCampaign: (data: any, isFinal?: boolean) => void;
  strategyId: string;
  funnelData: any;
  isLoading: boolean;
}

const AdCreativeGenerator: React.FC<AdCreativeGeneratorProps> = ({
  campaignData,
  onSaveCampaign,
  strategyId,
  funnelData,
  isLoading
}) => {
  const [adCreatives, setAdCreatives] = useState<any[]>(
    campaignData?.adCreatives || []
  );
  
  const [selectedAdSet, setSelectedAdSet] = useState<string>(
    campaignData?.adSets && campaignData.adSets.length > 0
      ? campaignData.adSets[0].id
      : ""
  );
  
  const [newAdCreative, setNewAdCreative] = useState({
    headline: "",
    body: "",
    cta: "LEARN_MORE",
    adSetId: selectedAdSet,
    imageUrl: "",
    primaryText: "",
    description: ""
  });
  
  const [isAddingCreative, setIsAddingCreative] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("standard");
  const [imagePrompt, setImagePrompt] = useState("");
  
  // CTA options for Meta ads
  const ctaOptions = [
    { value: "APPLY_NOW", label: "Apply Now" },
    { value: "BOOK_TRAVEL", label: "Book Travel" },
    { value: "CONTACT_US", label: "Contact Us" },
    { value: "DOWNLOAD", label: "Download" },
    { value: "LEARN_MORE", label: "Learn More" },
    { value: "SIGN_UP", label: "Sign Up" },
    { value: "SHOP_NOW", label: "Shop Now" },
    { value: "SUBSCRIBE", label: "Subscribe" }
  ];
  
  // Handle adding a new ad creative
  const handleAddCreative = () => {
    if (!newAdCreative.headline) {
      toast.error("Please enter a headline");
      return;
    }
    
    if (!newAdCreative.body) {
      toast.error("Please enter ad copy");
      return;
    }
    
    const updatedAdCreatives = [
      ...adCreatives,
      {
        id: `creative-${Date.now()}`,
        ...newAdCreative
      }
    ];
    
    setAdCreatives(updatedAdCreatives);
    
    // Reset form
    setNewAdCreative({
      headline: "",
      body: "",
      cta: "LEARN_MORE",
      adSetId: selectedAdSet,
      imageUrl: "",
      primaryText: "",
      description: ""
    });
    
    setIsAddingCreative(false);
    toast.success("Ad creative added");
  };
  
  // Handle removing an ad creative
  const handleRemoveCreative = (creativeId: string) => {
    const updatedAdCreatives = adCreatives.filter(creative => creative.id !== creativeId);
    setAdCreatives(updatedAdCreatives);
    toast.success("Ad creative removed");
  };
  
  // Save ad creatives
  const handleSave = () => {
    const updatedCampaign = {
      ...(campaignData || {}),
      adCreatives: adCreatives,
      lastUpdated: new Date().toISOString()
    };
    
    onSaveCampaign(updatedCampaign);
  };
  
  // Generate ad creative based on funnel data and selected ad set
  const handleGenerateCreative = async () => {
    if (!selectedAdSet) {
      toast.error("Please select an ad set first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Find the selected ad set
      const selectedAdSetData = campaignData?.adSets?.find(
        (adSet: any) => adSet.id === selectedAdSet
      );
      
      if (!selectedAdSetData) {
        throw new Error("Selected ad set not found");
      }
      
      // Generate creative based on ad set objective and funnel stage
      let headline = "";
      let body = "";
      let cta = "LEARN_MORE";
      let primaryText = "";
      let description = "";
      
      // Set default values based on objective
      if (selectedAdSetData.objective === "BRAND_AWARENESS") {
        headline = "Discover the Future of [Product Category]";
        body = "Introducing a new way to solve [pain point]. Join thousands of satisfied customers who've transformed their experience.";
        cta = "LEARN_MORE";
      } else if (selectedAdSetData.objective === "TRAFFIC") {
        headline = "See How [Product] Changes Everything";
        body = "Click to explore our complete guide on solving [pain point]. Actionable insights you can implement today!";
        cta = "LEARN_MORE";
      } else if (selectedAdSetData.objective === "LEAD_GENERATION") {
        headline = "Get Your Free [Lead Magnet]";
        body = "Download our exclusive guide to [solving pain point]. Enter your email to receive instant access.";
        cta = "SIGN_UP";
      } else if (selectedAdSetData.objective === "CONVERSIONS") {
        headline = "Transform Your [Pain Point] Today";
        body = "Join thousands of customers who've solved [pain point] with our solution. Limited time offer available now!";
        cta = "SHOP_NOW";
      }
      
      // Create the image prompt based on the headline and body
      const generatedImagePrompt = `Create a professional, high-quality Meta ad image for "${headline}". The ad is about ${body.substring(0, 100)}`;
      setImagePrompt(generatedImagePrompt);
      
      // Set the generated creative
      setNewAdCreative({
        headline,
        body,
        cta,
        adSetId: selectedAdSet,
        imageUrl: "",
        primaryText,
        description
      });
      
      setIsAddingCreative(true);
      toast.success("Ad creative generated");
      
    } catch (error) {
      console.error("Error generating ad creative:", error);
      toast.error("Failed to generate ad creative");
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading ad creative data...</span>
      </div>
    );
  }
  
  // Check if we have any ad sets defined
  const hasAdSets = campaignData?.adSets && campaignData.adSets.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Ad Creative Generator</h3>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateCreative}
            disabled={isGenerating || !hasAdSets}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Ad Creative
              </>
            )}
          </Button>
          <Button 
            onClick={() => {
              if (!hasAdSets) {
                toast.error("Please create ad sets first");
                return;
              }
              setIsAddingCreative(true);
              setNewAdCreative({...newAdCreative, adSetId: selectedAdSet});
            }}
            disabled={!hasAdSets}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Ad Creative
          </Button>
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Creatives
          </Button>
        </div>
      </div>
      
      {!hasAdSets && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-amber-800">
              Please create ad sets in the Campaign Structure tab before creating ad creatives.
            </p>
          </CardContent>
        </Card>
      )}
      
      {hasAdSets && (
        <div className="flex items-center space-x-4">
          <Label htmlFor="ad-set-selector" className="flex-shrink-0">Ad Set:</Label>
          <Select 
            value={selectedAdSet}
            onValueChange={setSelectedAdSet}
          >
            <SelectTrigger id="ad-set-selector" className="w-[250px]">
              <SelectValue placeholder="Select an ad set" />
            </SelectTrigger>
            <SelectContent>
              {campaignData.adSets.map((adSet: any) => (
                <SelectItem key={adSet.id} value={adSet.id}>
                  {adSet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {isAddingCreative && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Ad Creative</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-[400px] mb-4">
                <TabsTrigger value="standard">Standard Ad</TabsTrigger>
                <TabsTrigger value="image">Image Ad</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ad-headline">Headline</Label>
                    <Input
                      id="ad-headline"
                      value={newAdCreative.headline}
                      onChange={(e) => setNewAdCreative({...newAdCreative, headline: e.target.value})}
                      placeholder="Enter ad headline"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ad-cta">Call to Action</Label>
                    <Select 
                      value={newAdCreative.cta}
                      onValueChange={(value) => setNewAdCreative({...newAdCreative, cta: value})}
                    >
                      <SelectTrigger id="ad-cta">
                        <SelectValue placeholder="Select CTA" />
                      </SelectTrigger>
                      <SelectContent>
                        {ctaOptions.map((cta) => (
                          <SelectItem key={cta.value} value={cta.value}>
                            {cta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ad-body">Ad Copy</Label>
                  <Textarea
                    id="ad-body"
                    value={newAdCreative.body}
                    onChange={(e) => setNewAdCreative({...newAdCreative, body: e.target.value})}
                    placeholder="Enter the main ad text"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ad-primary-text">Primary Text (Optional)</Label>
                  <Textarea
                    id="ad-primary-text"
                    value={newAdCreative.primaryText}
                    onChange={(e) => setNewAdCreative({...newAdCreative, primaryText: e.target.value})}
                    placeholder="Additional text to display at the beginning of your ad"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ad-description">Description (Optional)</Label>
                  <Input
                    id="ad-description"
                    value={newAdCreative.description}
                    onChange={(e) => setNewAdCreative({...newAdCreative, description: e.target.value})}
                    placeholder="Additional text to show below headline"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="image" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image-prompt">Image Prompt</Label>
                  <Textarea
                    id="image-prompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    id="image-url"
                    value={newAdCreative.imageUrl}
                    onChange={(e) => setNewAdCreative({...newAdCreative, imageUrl: e.target.value})}
                    placeholder="Enter image URL"
                  />
                </div>
                
                {newAdCreative.imageUrl && (
                  <div className="border rounded-md p-2">
                    <img 
                      src={newAdCreative.imageUrl} 
                      alt="Ad preview" 
                      className="w-full h-auto max-h-64 object-contain"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingCreative(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCreative}>
                Add Creative
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Display existing ad creatives */}
      {adCreatives.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No ad creatives defined yet. Create ad creatives for your Meta campaign.
            </p>
            <Button 
              onClick={() => {
                if (!hasAdSets) {
                  toast.error("Please create ad sets first");
                  return;
                }
                setIsAddingCreative(true);
              }}
              variant="outline"
              disabled={!hasAdSets}
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first ad creative
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adCreatives.map((creative) => {
            // Find the ad set this creative belongs to
            const adSet = campaignData?.adSets?.find((adSet: any) => adSet.id === creative.adSetId);
            
            return (
              <Card key={creative.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{creative.headline}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveCreative(creative.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {creative.imageUrl && (
                    <div className="border rounded-md p-1 mb-2">
                      <img 
                        src={creative.imageUrl} 
                        alt={creative.headline} 
                        className="w-full h-auto max-h-40 object-contain"
                      />
                    </div>
                  )}
                  
                  <p className="text-muted-foreground text-sm">{creative.body}</p>
                  
                  {creative.primaryText && (
                    <div>
                      <span className="text-xs font-medium">Primary Text:</span>
                      <p className="text-xs text-muted-foreground">{creative.primaryText}</p>
                    </div>
                  )}
                  
                  {creative.description && (
                    <div>
                      <span className="text-xs font-medium">Description:</span>
                      <p className="text-xs text-muted-foreground">{creative.description}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-primary font-medium">
                      {creative.cta.replace("_", " ")}
                    </div>
                    
                    {adSet && (
                      <div className="text-xs text-muted-foreground">
                        Ad Set: {adSet.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdCreativeGenerator;
