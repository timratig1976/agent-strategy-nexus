
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdCampaignStructureProps {
  campaignData: any;
  onSaveCampaign: (data: any, isFinal?: boolean) => void;
  strategyId: string;
  isLoading: boolean;
}

const AdCampaignStructure: React.FC<AdCampaignStructureProps> = ({
  campaignData,
  onSaveCampaign,
  strategyId,
  isLoading
}) => {
  const [campaignName, setCampaignName] = useState<string>(
    campaignData?.name || ""
  );
  
  const [campaignObjective, setCampaignObjective] = useState<string>(
    campaignData?.objective || "BRAND_AWARENESS"
  );
  
  const [adSets, setAdSets] = useState<any[]>(
    campaignData?.adSets || []
  );
  
  const [isAddingAdSet, setIsAddingAdSet] = useState<boolean>(false);
  const [newAdSetName, setNewAdSetName] = useState<string>("");
  const [newAdSetObjective, setNewAdSetObjective] = useState<string>("BRAND_AWARENESS");
  const [newAdSetDescription, setNewAdSetDescription] = useState<string>("");
  
  const objectives = [
    { value: "BRAND_AWARENESS", label: "Brand Awareness" },
    { value: "TRAFFIC", label: "Traffic" },
    { value: "LEAD_GENERATION", label: "Lead Generation" },
    { value: "CONVERSIONS", label: "Conversions" }
  ];
  
  // Handle adding new ad set
  const handleAddAdSet = () => {
    if (!newAdSetName) {
      toast.error("Please enter a name for your ad set");
      return;
    }
    
    const newAdSet = {
      id: `adset-${Date.now()}`,
      name: newAdSetName,
      objective: newAdSetObjective,
      description: newAdSetDescription
    };
    
    setAdSets([...adSets, newAdSet]);
    setNewAdSetName("");
    setNewAdSetDescription("");
    setNewAdSetObjective("BRAND_AWARENESS");
    setIsAddingAdSet(false);
    
    toast.success("Ad set added successfully");
  };
  
  // Handle removing ad set
  const handleRemoveAdSet = (adSetId: string) => {
    setAdSets(adSets.filter((adSet) => adSet.id !== adSetId));
    toast.success("Ad set removed");
  };
  
  // Save campaign structure
  const handleSaveCampaign = () => {
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    const campaign = {
      ...campaignData,
      name: campaignName,
      objective: campaignObjective,
      adSets: adSets,
      lastUpdated: new Date().toISOString()
    };
    
    onSaveCampaign(campaign);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading campaign data...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Campaign Structure</h3>
        <Button 
          onClick={handleSaveCampaign}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Structure
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-objective">Campaign Objective</Label>
              <Select 
                value={campaignObjective}
                onValueChange={setCampaignObjective}
              >
                <SelectTrigger id="campaign-objective">
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map((objective) => (
                    <SelectItem key={objective.value} value={objective.value}>
                      {objective.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Ad Sets</h3>
        <Button 
          onClick={() => setIsAddingAdSet(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Ad Set
        </Button>
      </div>
      
      {isAddingAdSet && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Ad Set</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ad-set-name">Ad Set Name</Label>
                <Input
                  id="ad-set-name"
                  value={newAdSetName}
                  onChange={(e) => setNewAdSetName(e.target.value)}
                  placeholder="Enter ad set name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ad-set-objective">Ad Set Objective</Label>
                <Select 
                  value={newAdSetObjective}
                  onValueChange={setNewAdSetObjective}
                >
                  <SelectTrigger id="ad-set-objective">
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map((objective) => (
                      <SelectItem key={objective.value} value={objective.value}>
                        {objective.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ad-set-description">Description (Optional)</Label>
              <Textarea
                id="ad-set-description"
                value={newAdSetDescription}
                onChange={(e) => setNewAdSetDescription(e.target.value)}
                placeholder="Enter ad set description"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingAdSet(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddAdSet}>
                Add Ad Set
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {adSets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No ad sets defined yet. Create ad sets to organize your campaign.
            </p>
            <Button 
              onClick={() => setIsAddingAdSet(true)}
              variant="outline"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first ad set
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adSets.map((adSet) => (
            <Card key={adSet.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{adSet.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAdSet(adSet.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground">{adSet.description || "No description provided"}</div>
                <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded inline-flex">
                  {objectives.find(o => o.value === adSet.objective)?.label || adSet.objective}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdCampaignStructure;
