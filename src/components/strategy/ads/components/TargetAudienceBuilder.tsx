
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TargetAudienceBuilderProps {
  campaignData: any;
  onSaveCampaign: (data: any, isFinal?: boolean) => void;
  strategyId: string;
  isLoading: boolean;
}

const TargetAudienceBuilder: React.FC<TargetAudienceBuilderProps> = ({
  campaignData,
  onSaveCampaign,
  strategyId,
  isLoading
}) => {
  const [audiences, setAudiences] = useState<any[]>(
    campaignData?.targetAudiences || []
  );
  
  const [personaData, setPersonaData] = useState<any>(null);
  const [isLoadingPersona, setIsLoadingPersona] = useState<boolean>(false);
  
  const [newAudience, setNewAudience] = useState({
    name: "",
    description: "",
    ageRange: [18, 65],
    genders: ["FEMALE", "MALE"],
    locations: "",
    interests: [],
    behaviors: [],
    custom: false,
    lookalikeSource: "",
    exclusions: ""
  });
  
  const [isAddingAudience, setIsAddingAudience] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newBehavior, setNewBehavior] = useState("");
  
  // Load persona data to help with audience creation
  useEffect(() => {
    const loadPersonaData = async () => {
      try {
        setIsLoadingPersona(true);
        
        const { data, error } = await supabase
          .from("agent_results")
          .select("*")
          .eq("strategy_id", strategyId)
          .eq("metadata->>type", "persona")
          .eq("metadata->>is_final", "true")
          .order("created_at", { ascending: false })
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          try {
            const parsedPersona = JSON.parse(data.content);
            setPersonaData(parsedPersona);
          } catch (e) {
            console.error("Error parsing persona data:", e);
          }
        }
      } catch (err) {
        console.error("Error loading persona data:", err);
      } finally {
        setIsLoadingPersona(false);
      }
    };
    
    loadPersonaData();
  }, [strategyId]);
  
  // Handle adding a new audience
  const handleAddAudience = () => {
    if (!newAudience.name) {
      toast.error("Please enter a name for your audience");
      return;
    }
    
    const updatedAudiences = [
      ...audiences,
      {
        id: `audience-${Date.now()}`,
        ...newAudience
      }
    ];
    
    setAudiences(updatedAudiences);
    
    // Reset form
    setNewAudience({
      name: "",
      description: "",
      ageRange: [18, 65],
      genders: ["FEMALE", "MALE"],
      locations: "",
      interests: [],
      behaviors: [],
      custom: false,
      lookalikeSource: "",
      exclusions: ""
    });
    
    setIsAddingAudience(false);
    toast.success("Audience added");
  };
  
  // Handle removing an audience
  const handleRemoveAudience = (audienceId: string) => {
    const updatedAudiences = audiences.filter(audience => audience.id !== audienceId);
    setAudiences(updatedAudiences);
    toast.success("Audience removed");
  };
  
  // Save target audiences
  const handleSave = () => {
    const updatedCampaign = {
      ...(campaignData || {}),
      targetAudiences: audiences,
      lastUpdated: new Date().toISOString()
    };
    
    onSaveCampaign(updatedCampaign);
  };
  
  // Add interest to the new audience
  const handleAddInterest = () => {
    if (!newInterest) return;
    
    setNewAudience({
      ...newAudience,
      interests: [...newAudience.interests, newInterest]
    });
    
    setNewInterest("");
  };
  
  // Remove interest from the new audience
  const handleRemoveInterest = (interest: string) => {
    setNewAudience({
      ...newAudience,
      interests: newAudience.interests.filter(i => i !== interest)
    });
  };
  
  // Add behavior to the new audience
  const handleAddBehavior = () => {
    if (!newBehavior) return;
    
    setNewAudience({
      ...newAudience,
      behaviors: [...newAudience.behaviors, newBehavior]
    });
    
    setNewBehavior("");
  };
  
  // Remove behavior from the new audience
  const handleRemoveBehavior = (behavior: string) => {
    setNewAudience({
      ...newAudience,
      behaviors: newAudience.behaviors.filter(b => b !== behavior)
    });
  };
  
  // Create suggested audience based on persona data
  const createSuggestedAudience = () => {
    if (!personaData) {
      toast.error("No persona data available");
      return;
    }
    
    try {
      // Extract demographic information
      let ageRange = [25, 45]; // Default
      let genders = ["FEMALE", "MALE"]; // Default
      let locations = ""; // Default
      let interests: string[] = [];
      let behaviors: string[] = [];
      
      // Parse demographic information
      const demographic = personaData.demographic || "";
      
      // Try to extract age range
      const ageMatch = demographic.match(/(\d+)[\s-]*(\d+)/);
      if (ageMatch && ageMatch.length >= 3) {
        ageRange = [parseInt(ageMatch[1], 10), parseInt(ageMatch[2], 10)];
      }
      
      // Try to extract gender
      if (demographic.toLowerCase().includes("female") && !demographic.toLowerCase().includes("male")) {
        genders = ["FEMALE"];
      } else if (demographic.toLowerCase().includes("male") && !demographic.toLowerCase().includes("female")) {
        genders = ["MALE"];
      }
      
      // Try to extract location
      const locationPatterns = [
        /lives? in ([^,.]+)/i,
        /from ([^,.]+)/i,
        /based in ([^,.]+)/i,
        /located in ([^,.]+)/i
      ];
      
      for (const pattern of locationPatterns) {
        const match = demographic.match(pattern);
        if (match && match.length > 1) {
          locations = match[1].trim();
          break;
        }
      }
      
      // Extract interests from persona data
      if (personaData.interests) {
        interests = Array.isArray(personaData.interests) 
          ? personaData.interests 
          : personaData.interests.split(/[,;]/).map((i: string) => i.trim());
      }
      
      // Extract behaviors
      if (personaData.behaviors) {
        const behaviorText = typeof personaData.behaviors === 'string' ? personaData.behaviors : '';
        
        // Look for patterns like "shops online", "uses mobile devices"
        const behaviorPatterns = [
          /shops? online/i,
          /uses? mobile/i,
          /tech-?savvy/i,
          /early adopters?/i,
          /frequent travelers?/i
        ];
        
        for (const pattern of behaviorPatterns) {
          if (pattern.test(behaviorText)) {
            behaviors.push(pattern.toString().replace(/\/i|\//g, '').replace(/[\^$]/g, ''));
          }
        }
      }
      
      // Create a new audience based on extracted data
      const suggestedAudience = {
        name: `${personaData.name || "Target Persona"} Audience`,
        description: `Audience based on ${personaData.name || "target persona"} persona`,
        ageRange: ageRange,
        genders: genders,
        locations: locations,
        interests: interests.slice(0, 5), // Limit to 5 interests
        behaviors: behaviors,
        custom: false,
        lookalikeSource: "",
        exclusions: ""
      };
      
      setNewAudience(suggestedAudience);
      setIsAddingAudience(true);
      
      toast.success("Suggested audience created based on persona data");
      
    } catch (err) {
      console.error("Error creating suggested audience:", err);
      toast.error("Failed to create suggested audience");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading audience data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Target Audience Builder</h3>
        <div className="space-x-2">
          {personaData && (
            <Button 
              variant="outline" 
              onClick={createSuggestedAudience}
              className="flex items-center gap-2"
            >
              Create Suggested Audience
            </Button>
          )}
          <Button 
            onClick={() => setIsAddingAudience(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Audience
          </Button>
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Audiences
          </Button>
        </div>
      </div>
      
      {isAddingAudience && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="audience-name">Audience Name</Label>
                <Input
                  id="audience-name"
                  value={newAudience.name}
                  onChange={(e) => setNewAudience({...newAudience, name: e.target.value})}
                  placeholder="Enter audience name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience-description">Description</Label>
                <Input
                  id="audience-description"
                  value={newAudience.description}
                  onChange={(e) => setNewAudience({...newAudience, description: e.target.value})}
                  placeholder="Enter audience description"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Age Range: {newAudience.ageRange[0]} - {newAudience.ageRange[1]}</Label>
              <Slider
                defaultValue={newAudience.ageRange}
                min={13}
                max={65}
                step={1}
                value={newAudience.ageRange}
                onValueChange={(value) => setNewAudience({...newAudience, ageRange: value as [number, number]})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="flex space-x-2">
                <Button
                  variant={newAudience.genders.includes("FEMALE") ? "default" : "outline"}
                  onClick={() => {
                    const updatedGenders = newAudience.genders.includes("FEMALE")
                      ? newAudience.genders.filter(g => g !== "FEMALE")
                      : [...newAudience.genders, "FEMALE"];
                    setNewAudience({...newAudience, genders: updatedGenders});
                  }}
                  className="flex-1"
                >
                  Female
                </Button>
                <Button
                  variant={newAudience.genders.includes("MALE") ? "default" : "outline"}
                  onClick={() => {
                    const updatedGenders = newAudience.genders.includes("MALE")
                      ? newAudience.genders.filter(g => g !== "MALE")
                      : [...newAudience.genders, "MALE"];
                    setNewAudience({...newAudience, genders: updatedGenders});
                  }}
                  className="flex-1"
                >
                  Male
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="audience-locations">Locations</Label>
              <Textarea
                id="audience-locations"
                value={newAudience.locations}
                onChange={(e) => setNewAudience({...newAudience, locations: e.target.value})}
                placeholder="Enter target locations (e.g., New York, Los Angeles, Chicago)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newAudience.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {interest}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => handleRemoveInterest(interest)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                  className="flex-1"
                />
                <Button onClick={handleAddInterest}>Add</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Behaviors</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newAudience.behaviors.map((behavior, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {behavior}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => handleRemoveBehavior(behavior)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newBehavior}
                  onChange={(e) => setNewBehavior(e.target.value)}
                  placeholder="Add a behavior"
                  className="flex-1"
                />
                <Button onClick={handleAddBehavior}>Add</Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddingAudience(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddAudience}>
                Add Audience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {audiences.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No target audiences defined yet. Create audiences to target with your Meta ads.
            </p>
            <Button 
              onClick={() => setIsAddingAudience(true)}
              variant="outline"
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first audience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audiences.map((audience) => (
            <Card key={audience.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{audience.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAudience(audience.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {audience.description && (
                  <p className="text-sm text-muted-foreground">{audience.description}</p>
                )}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Age:</span> {audience.ageRange[0]}-{audience.ageRange[1]}
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span> {audience.genders.join(", ")}
                  </div>
                  {audience.locations && (
                    <div className="col-span-2">
                      <span className="font-medium">Locations:</span> {audience.locations}
                    </div>
                  )}
                </div>
                
                {audience.interests.length > 0 && (
                  <div>
                    <span className="font-medium text-sm">Interests:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {audience.interests.map((interest: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {audience.behaviors.length > 0 && (
                  <div>
                    <span className="font-medium text-sm">Behaviors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {audience.behaviors.map((behavior: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {behavior}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Card className="bg-slate-50 border border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">Tips for Effective Audience Targeting</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Create different audiences for each funnel stage to match user intent</li>
            <li>• Use lookalike audiences based on your existing customers for prospecting</li>
            <li>• Create retargeting audiences for users who have engaged with your content</li>
            <li>• Test both broad and narrow audience definitions to optimize performance</li>
            <li>• Exclude existing customers when targeting acquisition campaigns</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TargetAudienceBuilder;
