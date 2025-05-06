
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AdCreativeFormData, AdCreative, SavedAd } from "./types";
import { v4 as uuidv4 } from "uuid";

export const useAdCreative = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AdCreativeFormData>({
    platform: "facebook",
    adType: "image",
    productName: "",
    targetAudience: "",
    productDescription: "",
    uniqueSellingPoints: "",
    callToAction: "",
    tone: "professional",
    generateImage: false,
    imageDescription: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<AdCreative | null>(null);
  const [adCreatives, setAdCreatives] = useState<AdCreative[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("form");
  
  // Mock saved ads (would typically come from a database)
  const [savedCreatives, setSavedCreatives] = useState<SavedAd[]>(() => {
    const saved = localStorage.getItem("savedAdCreatives");
    return saved ? JSON.parse(saved) : [];
  });

  const generateAdCreatives = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Extract keywords/selling points from form data
      const sellingPoints = formData.uniqueSellingPoints
        .split(",")
        .map(point => point.trim())
        .filter(Boolean);
        
      // Get tone description
      const toneMap: Record<string, string> = {
        professional: "clear and business-like",
        friendly: "warm and approachable",
        humorous: "light-hearted and funny", 
        urgent: "creating a sense of urgency",
        informative: "educational and helpful",
        luxurious: "premium and high-end"
      };
      
      const toneDescription = toneMap[formData.tone] || "professional";
      
      // Generate headline options based on platform and tone
      const headlineOptions = [
        `Discover ${formData.productName}: ${sellingPoints[0] || "The Perfect Solution"}`,
        `${formData.callToAction} - ${formData.productName}`,
        sellingPoints[0] ? `${sellingPoints[0]} | ${formData.productName}` : `Introducing ${formData.productName}`,
        `Experience the Difference with ${formData.productName}`,
        `Why ${formData.targetAudience.split(" ")[0]} Choose ${formData.productName}`
      ];
      
      // Generate 3 ad variations
      const variations: AdCreative[] = Array(3).fill(0).map((_, index) => {
        // Select headline based on tone and platform
        let headline = headlineOptions[Math.floor(Math.random() * headlineOptions.length)];
        
        // Different character limit/style based on platform
        if (formData.platform === "twitter") {
          headline = headline.length > 50 ? headline.substring(0, 47) + "..." : headline;
        } else if (formData.platform === "google_ads") {
          headline = headlineOptions[Math.floor(Math.random() * 2)]; // Shorter headlines for Google
        }
        
        // Generate primary text based on description, selling points and tone
        let primaryText = `${formData.productDescription.substring(0, 100)}`;
        
        // Add selling points as bullet-point style statements
        if (sellingPoints.length > 0) {
          primaryText += "\n\n";
          primaryText += sellingPoints.slice(0, 3).map(point => `• ${point}`).join("\n");
        }
        
        // Adapt to platform-specific limitations
        if (formData.platform === "twitter") {
          primaryText = primaryText.length > 220 ? primaryText.substring(0, 217) + "..." : primaryText;
        } else if (formData.platform === "google_ads") {
          primaryText = primaryText.length > 90 ? primaryText.substring(0, 87) + "..." : primaryText;
        }
        
        // For LinkedIn, add a professional closing
        let description = "";
        if (formData.platform === "linkedin") {
          description = `Perfect for ${formData.targetAudience}. Connect with us to learn more about how ${formData.productName} can help you achieve your goals.`;
        }
        
        return {
          headline,
          primaryText: primaryText + (index === 0 ? " ✨" : index === 1 ? " 🔥" : " 💯"),
          description,
          callToAction: formData.callToAction,
          target: formData.targetAudience,
          platform: formData.platform,
          adType: formData.adType,
          imageUrl: formData.imageUrl,
          createdAt: new Date().toISOString()
        };
      });
      
      setAdCreatives(variations);
      setActiveTab("results");
      
      toast({
        title: "Ad creatives generated",
        description: `${variations.length} ad creatives have been successfully created.`,
      });
    } catch (error) {
      console.error("Error generating ad creative:", error);
      setError(error instanceof Error ? error.message : "Failed to generate ad creatives");
      
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate ad creative",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateAdCreatives();
  };

  const saveCreative = (creative: AdCreative) => {
    setIsSaving(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // For now, we'll simulate saving by storing in localStorage
      const newSavedAd: SavedAd = {
        ...creative,
        id: uuidv4(),
      };
      
      const updatedSavedAds = [...savedCreatives, newSavedAd];
      setSavedCreatives(updatedSavedAds);
      
      localStorage.setItem("savedAdCreatives", JSON.stringify(updatedSavedAds));
      
      toast({
        title: "Ad saved",
        description: "Your ad creative has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving ad creative:", error);
      toast({
        title: "Save failed",
        description: "Failed to save ad creative.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSavedCreative = (id: string) => {
    try {
      const updatedSavedAds = savedCreatives.filter(ad => ad.id !== id);
      setSavedCreatives(updatedSavedAds);
      localStorage.setItem("savedAdCreatives", JSON.stringify(updatedSavedAds));
      
      toast({
        title: "Ad deleted",
        description: "The ad creative has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting ad creative:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete ad creative.",
        variant: "destructive",
      });
    }
  };

  const resetGenerator = () => {
    setResult(null);
    setAdCreatives([]);
    setActiveTab("form");
  };

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    result,
    adCreatives,
    savedCreatives,
    error,
    activeTab,
    setActiveTab,
    handleSubmit,
    generateAdCreatives,
    saveCreative,
    deleteSavedCreative,
    resetGenerator,
    resetForm: resetGenerator
  };
};
