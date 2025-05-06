
import { useState } from "react";
import { CampaignIdea, CampaignFormData } from "./types";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "uuid";

// Sample campaign ideas to simulate AI generation
const generateSampleIdeas = (formData: CampaignFormData): CampaignIdea[] => {
  const ideas: CampaignIdea[] = [];
  
  // Sample campaign idea themes based on objectives
  const campaignThemes = [
    "Seasonal promotion",
    "User-generated content contest",
    "Brand awareness campaign",
    "Community engagement initiative",
    "Product launch campaign",
    "Loyalty rewards program",
    "Educational content series",
    "Influencer partnership campaign"
  ];
  
  // Generate 3 different ideas
  for (let i = 0; i < 3; i++) {
    const themeIndex = Math.floor(Math.random() * campaignThemes.length);
    const theme = campaignThemes[themeIndex];
    
    // Select random channels (2-3)
    const availableChannels = formData.channels.length > 0 ? 
      formData.channels : 
      ["Social Media", "Email", "Content Marketing", "SEO", "PPC", "Events"];
    
    const shuffledChannels = [...availableChannels].sort(() => 0.5 - Math.random());
    const selectedChannels = shuffledChannels.slice(0, Math.min(3, shuffledChannels.length));
    
    // Generate random objectives based on the form data
    const objectives = formData.objective ? 
      [formData.objective, "Brand awareness"] : 
      ["Lead generation", "Brand awareness", "Customer retention"];
    
    const shuffledObjectives = [...objectives].sort(() => 0.5 - Math.random());
    const selectedObjectives = shuffledObjectives.slice(0, Math.min(2, shuffledObjectives.length));
    
    // Create idea
    ideas.push({
      id: uuidv4(),
      title: `${theme} for ${formData.industry || "Your Industry"}`,
      description: `A ${formData.tone || "professional"} campaign targeting ${formData.audience || "your target audience"} with a focus on ${selectedObjectives.join(" and ")}. This campaign will ${i === 0 ? "showcase your brand values" : i === 1 ? "highlight customer success stories" : "emphasize your unique selling points"}.`,
      channels: selectedChannels,
      objectives: selectedObjectives,
      targetAudience: formData.audience || "Not specified",
      estimatedBudget: formData.budget || "Not specified",
      estimatedTimeframe: formData.timeframe || "Not specified",
      createdAt: new Date()
    });
  }
  
  return ideas;
};

export const useCampaignIdeas = () => {
  const [activeTab, setActiveTab] = useState<string>("form");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [campaignIdeas, setCampaignIdeas] = useState<CampaignIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<CampaignIdea[]>([]);
  
  const [formData, setFormData] = useState<CampaignFormData>({
    industry: "",
    objective: "Lead generation",
    audience: "",
    budget: "5000-10000",
    timeframe: "1-3 months",
    channels: ["Social Media", "Email"],
    tone: "Professional",
    additionalInfo: ""
  });

  const generateCampaignIdeas = async () => {
    setError(null);
    
    // Validate inputs
    if (!formData.industry) {
      setError("Please enter your industry");
      return;
    }

    if (!formData.objective) {
      setError("Please select a campaign objective");
      return;
    }
    
    setIsGenerating(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample ideas
      const ideas = generateSampleIdeas(formData);
      
      setCampaignIdeas(ideas);
      setActiveTab("results");
      
      toast.success("Campaign ideas generated successfully");
    } catch (err) {
      setError("An error occurred while generating campaign ideas. Please try again.");
      console.error("Campaign idea generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveIdea = (idea: CampaignIdea) => {
    setSavedIdeas(prev => {
      const exists = prev.some(i => i.id === idea.id);
      if (exists) {
        return prev;
      }
      return [...prev, idea];
    });
    toast.success("Campaign idea saved");
  };

  const deleteSavedIdea = (id: string) => {
    setSavedIdeas(prev => prev.filter(idea => idea.id !== id));
    toast.success("Campaign idea removed");
  };
  
  const resetGenerator = () => {
    setActiveTab("form");
  };

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    isGenerating,
    error,
    campaignIdeas,
    savedIdeas,
    generateCampaignIdeas,
    saveIdea,
    deleteSavedIdea,
    resetGenerator
  };
};
