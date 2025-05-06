
import { useState } from "react";
import { AdCreative, AdCreativeFormData } from "./types";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "uuid";

// Sample ad creative templates to simulate AI generation
const generateSampleAdCreatives = (formData: AdCreativeFormData): AdCreative[] => {
  const creatives: AdCreative[] = [];
  
  // Get platforms from form data or use defaults
  const platforms = formData.adPlatforms.length > 0 ? 
    formData.adPlatforms : 
    ["Facebook", "Instagram", "Google Ads"];
  
  // Generate creatives for selected platforms
  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    
    // Determine format based on platform
    let format: string;
    switch (platform) {
      case "Facebook":
        format = "Feed Ad";
        break;
      case "Instagram":
        format = "Story Ad";
        break;
      case "LinkedIn":
        format = "Sponsored Content";
        break;
      case "Google Ads":
        format = "Responsive Search Ad";
        break;
      case "TikTok":
        format = "In-Feed Ad";
        break;
      default:
        format = "Standard Ad";
    }
    
    // Generate headlines based on campaign objective
    let headline: string;
    if (formData.campaignObjective.includes("awareness")) {
      headline = `Discover ${formData.productService} - The Solution You've Been Looking For`;
    } else if (formData.campaignObjective.includes("conversion")) {
      headline = `Limited Time: Get ${formData.productService} Today & See Results`;
    } else if (formData.campaignObjective.includes("engagement")) {
      headline = `Join Thousands Who Love ${formData.productService}`;
    } else {
      headline = `Introducing ${formData.productService}: Designed for ${formData.targetAudience}`;
    }
    
    // Generate descriptions based on key benefits
    const benefits = formData.keyBenefits || ["save time", "improve results", "reduce costs"];
    let description: string;
    if (benefits.length > 0) {
      description = `Experience ${benefits[0]} and ${benefits.length > 1 ? benefits[1] : "more"} with our ${formData.productService}. Perfect for ${formData.targetAudience} looking to elevate their experience.`;
    } else {
      description = `Our ${formData.productService} delivers outstanding results for ${formData.targetAudience}. Don't miss this opportunity!`;
    }
    
    const visualDescriptions = [
      `A modern, clean image showing ${formData.productService} being used in a real-world context by the target audience.`,
      `A vibrant, attention-grabbing graphic highlighting the key benefit: ${benefits[0] || "main feature"}.`,
      `A striking before-and-after comparison demonstrating the value of ${formData.productService}.`
    ];
    
    creatives.push({
      id: uuidv4(),
      headline,
      description,
      callToAction: formData.callToAction || "Learn More",
      platform,
      format,
      visualDescription: visualDescriptions[i % visualDescriptions.length],
      targetAudience: formData.targetAudience,
      createdAt: new Date()
    });
  }
  
  return creatives;
};

export const useAdCreative = () => {
  const [activeTab, setActiveTab] = useState<string>("form");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [adCreatives, setAdCreatives] = useState<AdCreative[]>([]);
  const [savedCreatives, setSavedCreatives] = useState<AdCreative[]>([]);
  
  const [formData, setFormData] = useState<AdCreativeFormData>({
    campaignObjective: "brand_awareness",
    targetAudience: "",
    productService: "",
    keyBenefits: [],
    brandTone: "Professional",
    adPlatforms: ["Facebook", "Instagram"],
    callToAction: "Learn More",
    additionalNotes: ""
  });

  const generateAdCreatives = async () => {
    setError(null);
    
    // Validate inputs
    if (!formData.productService) {
      setError("Please enter your product or service name");
      return;
    }

    if (!formData.targetAudience) {
      setError("Please describe your target audience");
      return;
    }
    
    setIsGenerating(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample ad creatives
      const creatives = generateSampleAdCreatives(formData);
      
      setAdCreatives(creatives);
      setActiveTab("results");
      
      toast.success("Ad creatives generated successfully");
    } catch (err) {
      setError("An error occurred while generating ad creatives. Please try again.");
      console.error("Ad creative generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCreative = (creative: AdCreative) => {
    setSavedCreatives(prev => {
      const exists = prev.some(c => c.id === creative.id);
      if (exists) {
        return prev;
      }
      return [...prev, creative];
    });
    toast.success("Ad creative saved");
  };

  const deleteSavedCreative = (id: string) => {
    setSavedCreatives(prev => prev.filter(creative => creative.id !== id));
    toast.success("Ad creative removed");
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
    adCreatives,
    savedCreatives,
    generateAdCreatives,
    saveCreative,
    deleteSavedCreative,
    resetGenerator
  };
};
