
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ContentStrategyFormData, ContentPillar, ContentIdea, ContentSubtopic } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const useContentStrategy = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContentStrategyFormData>({
    keyword: "",
    targetAudience: "",
    businessGoals: "",
    contentType: "",
    tone: "",
    additionalInfo: ""
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
      const mockPillar = generateMockContentPillar(formData);
      
      setTimeout(() => {
        setContentPillars([mockPillar]);
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

// Helper function to generate mock pillar
const generateMockContentPillar = (formData: ContentStrategyFormData): ContentPillar => {
  // Generate subtopics
  const subtopics = [
    'Fundamentals',
    'Advanced strategies',
    'Case studies',
    'Trends and insights'
  ].map(name => {
    return {
      id: uuidv4(),
      title: `${formData.keyword} ${name}`,
      description: `A detailed exploration of ${formData.keyword} ${name.toLowerCase()} for ${formData.targetAudience}.`,
      contentIdeas: generateContentIdeas(formData.keyword, name)
    };
  });
  
  return {
    id: uuidv4(),
    title: formData.keyword,
    description: `A comprehensive content pillar about ${formData.keyword} for ${formData.targetAudience} in the ${formData.businessGoals} industry.`,
    subtopics: subtopics,
    keywords: generateKeywords(formData.keyword),
    formats: ['Blog Post', 'Video', 'Infographic', 'Webinar', 'Podcast'],
    channels: ['Website', 'LinkedIn', 'Email', 'YouTube', 'Twitter'],
    createdAt: new Date()
  };
};

// Helper function to generate mock content ideas
const generateContentIdeas = (topic: string, subtopic: string): ContentIdea[] => {
  const ideas = [
    {
      id: uuidv4(),
      title: `Ultimate guide to ${topic} ${subtopic.toLowerCase()}`,
      description: `An in-depth guide covering all aspects of ${topic} ${subtopic.toLowerCase()}.`,
      format: 'Long-form Blog',
      example: `"10 Essential ${topic} ${subtopic.toLowerCase()} Every Professional Should Know"`
    },
    {
      id: uuidv4(),
      title: `${topic} ${subtopic.toLowerCase()} explained`,
      description: `Simple explanation of complex ${topic} ${subtopic.toLowerCase()} concepts.`,
      format: 'Video',
      example: `"${topic} ${subtopic.toLowerCase()} Explained in 5 Minutes"`
    },
    {
      id: uuidv4(),
      title: `${subtopic} checklist for ${topic}`,
      description: `A practical checklist for implementing ${topic} ${subtopic.toLowerCase()}.`,
      format: 'Downloadable PDF'
    }
  ];
  
  return ideas;
};

// Helper function to generate keywords
const generateKeywords = (topic: string): string[] => {
  return [
    topic,
    `${topic} guide`,
    `${topic} tips`,
    `${topic} strategy`,
    `best ${topic} practices`
  ];
};
