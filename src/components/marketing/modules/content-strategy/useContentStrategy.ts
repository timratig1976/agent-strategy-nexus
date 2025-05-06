
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ContentPillarFormData, ContentPillar } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const useContentStrategy = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContentPillarFormData>({
    businessNiche: "",
    targetAudience: "",
    brandVoice: [],
    marketingGoals: [],
    existingContent: "",
    competitorInsights: "",
    keyTopics: [],
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
      // In a real app, this would be an API call to generate content pillars
      // For now, we'll simulate the response with mock data
      const mockPillars = generateMockContentPillars(formData);
      
      setTimeout(() => {
        setContentPillars(mockPillars);
        setActiveTab("results");
        setIsGenerating(false);
      }, 2000);
    } catch (err) {
      setError("Failed to generate content pillars. Please try again.");
      setIsGenerating(false);
      console.error("Error generating content pillars:", err);
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

// Helper function to generate mock pillars
const generateMockContentPillars = (formData: ContentPillarFormData): ContentPillar[] => {
  const pillars: ContentPillar[] = [];
  
  // Generate between 3-5 pillars
  const topicCount = Math.min(formData.keyTopics.length, 5);
  
  for (let i = 0; i < topicCount; i++) {
    if (formData.keyTopics[i]) {
      const topicName = formData.keyTopics[i];
      
      const subtopics = [
        `${topicName} fundamentals`,
        `Advanced ${topicName} strategies`,
        `${topicName} case studies`,
        `${topicName} trends and insights`
      ];
      
      const contentIdeas = createContentIdeas(
        topicName, 
        formData.contentFormats,
        formData.distributionChannels,
        formData.targetAudience
      );
      
      pillars.push({
        id: uuidv4(),
        title: topicName,
        description: `A comprehensive content pillar about ${topicName} for ${formData.targetAudience} in the ${formData.businessNiche} industry.`,
        targetAudience: formData.targetAudience,
        keySubtopics: subtopics,
        contentIdeas: contentIdeas,
        keywords: generateKeywords(topicName),
        contentFormats: formData.contentFormats,
        distributionChannels: formData.distributionChannels,
        createdAt: new Date()
      });
    }
  }
  
  return pillars;
};

const createContentIdeas = (
  topic: string,
  formats: string[],
  channels: string[],
  audience: string
): ContentIdeaItem[] => {
  const ideas: ContentIdeaItem[] = [];
  
  const possibleEfforts = ["Low", "Medium", "High"];
  
  for (let i = 0; i < Math.min(formats.length, 5); i++) {
    if (formats[i]) {
      ideas.push({
        title: `The ultimate guide to ${topic}`,
        format: formats[i],
        channel: channels[Math.min(i, channels.length - 1)],
        audience: audience,
        estimatedEffort: possibleEfforts[Math.floor(Math.random() * possibleEfforts.length)]
      });
    }
  }
  
  return ideas;
};

const generateKeywords = (topic: string): string[] => {
  return [
    topic,
    `${topic} guide`,
    `${topic} tips`,
    `${topic} strategy`,
    `best ${topic} practices`
  ];
};
