
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ContentStrategyFormData, ContentPillar, ContentIdea, ContentSubtopic } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { MarketingAIService } from "@/services/marketingAIService";

export const useContentStrategy = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContentStrategyFormData>({
    keyword: "",
    targetAudience: "",
    businessGoals: "",
    contentType: "",
    tone: "",
    additionalInfo: "",
    // Initialize the new fields
    marketingGoals: [],
    existingContent: "",
    competitorInsights: "",
    contentFormats: [],
    distributionChannels: []
  });

  const [contentPillars, setContentPillars] = useState<ContentPillar[]>([]);
  const [savedPillars, setSavedPillars] = useState<ContentPillar[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("form");

  const generateContentPillars = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      toast({
        title: "Generating content strategy",
        description: "Using AI to generate your content pillars...",
      });

      // Call the AI service to generate content pillars
      const { data, error: aiError } = await MarketingAIService.generateContent<ContentPillar>(
        'contentStrategy',
        'generate',
        formData
      );

      if (aiError) {
        throw new Error(aiError);
      }

      if (!data) {
        throw new Error("No content pillars were generated");
      }

      // Add unique ID to the content pillar
      const pillarWithId: ContentPillar = {
        ...data,
        id: uuidv4(),
        createdAt: new Date() // Ensure we have a proper Date object
      };

      setContentPillars([pillarWithId]);
      setActiveTab("results");
      
      toast({
        title: "Content strategy generated",
        description: "Your AI-powered content strategy is ready to review.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content pillars. Please try again.");
      toast({
        title: "Generation failed",
        description: err instanceof Error ? err.message : "Failed to generate content pillars",
        variant: "destructive"
      });
      console.error("Error generating content pillars:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const savePillar = (pillar: ContentPillar) => {
    setSavedPillars([...savedPillars, pillar]);
    
    toast({
      title: "Content pillar saved",
      description: "The content pillar has been added to your saved pillars."
    });
  };

  const deleteSavedPillar = (id: string) => {
    setSavedPillars(savedPillars.filter(pillar => pillar.id !== id));
    
    toast({
      title: "Content pillar deleted",
      description: "The content pillar has been removed from your saved pillars."
    });
  };

  const resetGenerator = () => {
    setContentPillars([]);
    setActiveTab("form");
  };

  return {
    formData,
    setFormData,
    contentPillars,
    savedPillars,
    isGenerating,
    error,
    activeTab,
    setActiveTab,
    generateContentPillars,
    savePillar,
    deleteSavedPillar,
    resetGenerator
  };
};
