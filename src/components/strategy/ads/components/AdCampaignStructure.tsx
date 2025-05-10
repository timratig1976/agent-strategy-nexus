
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AdCampaignStructureProps {
  campaignData: any;
  onSaveCampaign: (data: any, isFinal?: boolean) => void;
  funnelData: any;
  isLoading: boolean;
}

const AdCampaignStructure: React.FC<AdCampaignStructureProps> = ({
  campaignData,
  onSaveCampaign,
  funnelData,
  isLoading
}) => {
  // Create a form state that copies campaign data
  const [formData, setFormData] = useState({
    name: campaignData?.name || "",
    objective: campaignData?.objective || "CONVERSIONS",
    adSets: campaignData?.adSets || []
  });
  
  const [newAdSet, setNewAdSet] = useState({
    name: "",
    objective: "CONVERSIONS",
    funnelStage: "",
    budget: 0,
    targetAudience: ""
  });
  
  const [isAddingAdSet, setIsAddingAdSet] = useState(false);
  
  // Campaign objectives for Meta Ads
  const campaignObjectives = [
    { value: "BRAND_AWARENESS", label: "Brand Awareness" },
    { value: "REACH", label: "Reach" },
    { value: "TRAFFIC", label: "Traffic" },
    { value: "APP_INSTALLS", label: "App Installs" },
    { value: "LEAD_GENERATION", label: "Lead Generation" },
    { value: "CONVERSIONS", label: "Conversions" },
    { value: "CATALOG_SALES", label: "Catalog Sales" },
    { value: "STORE_TRAFFIC", label: "Store Traffic" }
  ];
  
  const funnelStages = funnelData?.stages || [];
  
  // Handle form field changes
  const handleFormChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  // Handle adding a new ad set
  const handleAddAdSet = () => {
    if (!newAdSet.name) {
      toast.error("Please enter a name for your ad set");
      return;
    }
    
    const updatedAdSets = [
      ...formData.adSets,
      {
        id: `adset-${Date.now()}`,
        ...newAdSet
      }
    ];
    
    setFormData({
      ...formData,
      adSets: updatedAdSets
    });
    
    setNewAdSet({
      name: "",
      objective: "CONVERSIONS",
      funnelStage: "",
      budget: 0,
      targetAudience: ""
    });
    
    setIsAddingAdSet(false);
    toast.success("Ad set added");
  };
  
  // Handle removing an ad set
  const handleRemoveAdSet = (adSetId: string) => {
    const updatedAdSets = formData.adSets.filter((adSet: any) => adSet.id !== adSetId);
    
    setFormData({
      ...formData,
      adSets: updatedAdSets
    });
    
    toast.success("Ad set removed");
  };
  
  // Save campaign structure
  const handleSave = () => {
    if (!formData.name) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    const updatedCampaign = {
      ...(campaignData || {}),
      name: formData.name,
      objective: formData.objective,
      adSets: formData.adSets,
      lastUpdated: new Date().toISOString()
    };
    
    onSaveCampaign(updatedCampaign);
  };
  
  // Create recommended ad sets based on funnel stages
  const handleCreateRecommended = () => {
    if (!funnelData || !funnelData.stages || funnelData.stages.length === 0) {
      toast.error("No funnel data available to create recommended ad sets");
      return;
    }
    
    const recommendedAdSets = funnelData.stages.map((stage: any, index: number) => {
      // Choose appropriate objective based on funnel stage
      let objective = "CONVERSIONS";
      if (index === 0) {
        objective = "BRAND_AWARENESS";
      } else if (index === 1) {
        objective = "TRAFFIC";
      } else if (index === funnelData.stages.length - 1) {
        objective = "CONVERSIONS";
      } else if (index === funnelData.stages.length - 2) {
        objective = "LEAD_GENERATION";
      }
      
      // Allocate budget based on funnel position
      // Top of funnel gets more budget, bottom gets less but more targeted
      const totalBudget = 1000; // Default
      let budgetPercentage;
      
      if (funnelData.stages.length <= 3) {
        // For simpler funnels
        budgetPercentage = index === 0 ? 0.4 : 0.3;
      } else {
        // For more complex funnels
        if (index === 0) {
          budgetPercentage = 0.3; // Awareness
        } else if (index === funnelData.stages.length - 1) {
          budgetPercentage = 0.25; // Conversion
        } else {
          budgetPercentage = 0.45 / (funnelData.stages.length - 2); // Middle stages
        }
      }
      
      const budget = Math.round(totalBudget * budgetPercentage);
      
      return {
        id: `adset-${Date.now()}-${index}`,
        name: `${stage.name} - ${objective.charAt(0) + objective.slice(1).toLowerCase().replace('_', ' ')}`,
        objective,
        funnelStage: stage.id,
        budget,
        targetAudience: ""
      };
    });
    
    setFormData({
      ...formData,
      adSets: recommendedAdSets
    });
    
    toast.success("Recommended ad sets created based on funnel stages");
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading campaign structure...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Campaign Structure</h3>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Campaign Structure
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
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-objective">Primary Objective</Label>
              <Select 
                value={formData.objective}
                onValueChange={(value) => handleFormChange('objective', value)}
              >
                <SelectTrigger id="campaign-objective">
                  <SelectValue placeholder="Select objective" />
                </SelectTrigger>
                <SelectContent>
                  {campaignObjectives.map((objective) => (
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
        <div className="space-x-2">
          {funnelData && funnelData.stages && funnelData.stages.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleCreateRecommended}
              className="flex items-center gap-2"
            >
              Create Recommended
            </Button>
          )}
          <Button 
            onClick={() => setIsAddingAdSet(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Ad Set
          </Button>
        </div>
      </div>
      
      {isAddingAdSet && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Ad Set</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adset-name">Ad Set Name</Label>
                <Input
                  id="adset-name"
                  value={newAdSet.name}
                  onChange={(e) => setNewAdSet({...newAdSet, name: e.target.value})}
                  placeholder="Enter ad set name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adset-objective">Objective</Label>
                <Select 
                  value={newAdSet.objective}
                  onValueChange={(value) => setNewAdSet({...newAdSet, objective: value})}
                >
                  <SelectTrigger id="adset-objective">
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignObjectives.map((objective) => (
                      <SelectItem key={objective.value} value={objective.value}>
                        {objective.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adset-funnel-stage">Funnel Stage</Label>
                <Select 
                  value={newAdSet.funnelStage}
                  onValueChange={(value) => setNewAdSet({...newAdSet, funnelStage: value})}
                >
                  <SelectTrigger id="adset-funnel-stage">
                    <SelectValue placeholder="Select funnel stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {funnelStages.map((stage: any) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adset-budget">Daily Budget</Label>
                <Input
                  id="adset-budget"
                  type="number"
                  value={newAdSet.budget || ""}
                  onChange={(e) => setNewAdSet({...newAdSet, budget: Number(e.target.value)})}
                  placeholder="Enter daily budget"
                />
              </div>
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
      
      {formData.adSets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No ad sets defined yet. Add ad sets to structure your Meta campaign.
            </p>
            <Button 
              onClick={() => setIsAddingAdSet(true)}
              variant="outline"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first ad set
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Objective</TableHead>
                  <TableHead>Funnel Stage</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.adSets.map((adSet: any) => (
                  <TableRow key={adSet.id}>
                    <TableCell className="font-medium">{adSet.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {adSet.objective.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {adSet.funnelStage && funnelStages.find((s: any) => s.id === adSet.funnelStage)?.name}
                    </TableCell>
                    <TableCell>${adSet.budget}/day</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAdSet(adSet.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <Card className="bg-slate-50 border border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">Tips for Effective Campaign Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Create separate ad sets for different funnel stages to target customers at different stages of awareness.</li>
            <li>• Use the appropriate campaign objective that aligns with each funnel stage's goal.</li>
            <li>• Allocate budget based on strategic importance and expected return at each stage.</li>
            <li>• Consider creating specialized ad sets for remarketing to previous website visitors.</li>
            <li>• Keep your campaign structure organized and aligned with your funnel strategy.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdCampaignStructure;
