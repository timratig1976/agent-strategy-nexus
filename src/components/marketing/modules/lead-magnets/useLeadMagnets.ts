
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LeadMagnetFormData, LeadMagnet } from "./types";
import { useToast } from "@/components/ui/use-toast";

export const useLeadMagnets = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LeadMagnetFormData>({
    businessType: "",
    targetAudience: "",
    problemSolving: "",
    marketingGoals: [],
    existingContent: "",
    brandVoice: [],
    funnelStage: [],
    contentFormats: []
  });

  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [savedMagnets, setSavedMagnets] = useState<LeadMagnet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("form");

  const generateLeadMagnets = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // In a real app, this would be an API call to generate lead magnets
      // For now, we'll simulate the response with mock data
      const mockMagnets = generateMockLeadMagnets(formData);
      
      setTimeout(() => {
        setLeadMagnets(mockMagnets);
        setActiveTab("results");
        setIsGenerating(false);
      }, 2000);
    } catch (err) {
      setError("Failed to generate lead magnets. Please try again.");
      setIsGenerating(false);
      console.error("Error generating lead magnets:", err);
    }
  };

  const saveMagnet = (magnet: LeadMagnet) => {
    setSavedMagnets([...savedMagnets, magnet]);
    
    toast({
      title: "Lead magnet saved",
      description: "The lead magnet has been added to your saved collection."
    });
  };

  const deleteSavedMagnet = (id: string) => {
    setSavedMagnets(savedMagnets.filter(magnet => magnet.id !== id));
    
    toast({
      title: "Lead magnet deleted",
      description: "The lead magnet has been removed from your saved collection."
    });
  };

  const resetGenerator = () => {
    setLeadMagnets([]);
    setActiveTab("form");
  };

  return {
    formData,
    setFormData,
    leadMagnets,
    savedMagnets,
    isGenerating,
    error,
    activeTab,
    setActiveTab,
    generateLeadMagnets,
    saveMagnet,
    deleteSavedMagnet,
    resetGenerator
  };
};

// Helper function to generate mock lead magnets
const generateMockLeadMagnets = (formData: LeadMagnetFormData): LeadMagnet[] => {
  const magnets: LeadMagnet[] = [];
  
  // Generate different types of lead magnets based on funnel stage and formats
  const funnelStages = formData.funnelStage.length > 0 
    ? formData.funnelStage 
    : ["awareness", "consideration", "conversion"];
    
  const contentFormats = formData.contentFormats.length > 0 
    ? formData.contentFormats 
    : ["ebook", "webinar", "checklist", "template"];
  
  // Generate at least one lead magnet per funnel stage
  for (const stage of funnelStages) {
    // Pick a content format for this funnel stage
    const formatIndex = Math.floor(Math.random() * contentFormats.length);
    const format = contentFormats[formatIndex];
    
    const magnet = createLeadMagnet(
      format,
      stage,
      formData.targetAudience,
      formData.businessType,
      formData.problemSolving
    );
    
    magnets.push(magnet);
  }
  
  return magnets;
};

const createLeadMagnet = (
  format: string,
  funnelStage: string,
  audience: string,
  businessType: string,
  problemSolving: string
): LeadMagnet => {
  // Generate title based on format and business type
  let title = "";
  let description = "";
  let contentOutline: string[] = [];
  let estimatedConversionRate = "";
  let implementationSteps: string[] = [];
  let callToAction = "";
  
  // Default values if inputs are empty
  const defaultAudience = audience || "professionals";
  const defaultBusiness = businessType || "business";
  const defaultProblem = problemSolving || "challenges in the industry";
  
  // Generate content based on format
  switch(format.toLowerCase()) {
    case "ebook":
      title = `The Ultimate Guide to Solving ${defaultProblem} for ${defaultAudience}`;
      description = `A comprehensive ebook that helps ${defaultAudience} understand and overcome common ${defaultProblem} in the ${defaultBusiness} industry.`;
      contentOutline = [
        "Chapter 1: Understanding the Challenge",
        "Chapter 2: Key Strategies for Success",
        "Chapter 3: Implementation Guide",
        "Chapter 4: Case Studies and Examples",
        "Chapter 5: Resources and Tools"
      ];
      estimatedConversionRate = "15-20%";
      break;
      
    case "webinar":
      title = `Live Masterclass: How to Overcome ${defaultProblem} in Just 60 Minutes`;
      description = `An interactive webinar designed to show ${defaultAudience} practical techniques to solve ${defaultProblem} in their ${defaultBusiness}.`;
      contentOutline = [
        "Introduction: The Current State of the Industry",
        "Section 1: Common Mistakes to Avoid",
        "Section 2: Step-by-Step Solutions",
        "Section 3: Live Q&A Session",
        "Section 4: Exclusive Offer for Attendees"
      ];
      estimatedConversionRate = "25-35%";
      break;
      
    case "checklist":
      title = `${defaultAudience}'s Essential Checklist for Solving ${defaultProblem}`;
      description = `A practical, actionable checklist that guides ${defaultAudience} through the process of addressing ${defaultProblem} effectively.`;
      contentOutline = [
        "Pre-Assessment Items",
        "Planning Phase Checklist",
        "Implementation Steps",
        "Quality Control Measures",
        "Follow-Up Actions"
      ];
      estimatedConversionRate = "30-40%";
      break;
      
    case "template":
      title = `Ready-to-Use Template: ${defaultProblem} Solution for ${defaultAudience}`;
      description = `A professional template that helps ${defaultAudience} implement proven solutions for ${defaultProblem} in their ${defaultBusiness}.`;
      contentOutline = [
        "Template Section 1: Strategy Overview",
        "Template Section 2: Implementation Timeline",
        "Template Section 3: Resource Allocation",
        "Template Section 4: KPI Tracking",
        "Template Section 5: Optimization Guide"
      ];
      estimatedConversionRate = "20-30%";
      break;
      
    default:
      title = `Essential Resource: Solving ${defaultProblem} for ${defaultAudience}`;
      description = `A valuable resource designed to help ${defaultAudience} overcome ${defaultProblem} in their ${defaultBusiness}.`;
      contentOutline = [
        "Part 1: Understanding the Challenge",
        "Part 2: Strategic Solutions",
        "Part 3: Implementation Guide",
        "Part 4: Success Metrics",
        "Part 5: Next Steps"
      ];
      estimatedConversionRate = "15-25%";
  }
  
  // Generate implementation steps
  implementationSteps = [
    "Create content outline and detailed structure",
    "Develop first draft with key insights and actionable advice",
    "Design professional layout and visuals",
    "Set up landing page with opt-in form",
    "Create email sequence for delivery and follow-up"
  ];
  
  // Generate call-to-action based on funnel stage
  switch(funnelStage.toLowerCase()) {
    case "awareness":
      callToAction = "Download Your Free Guide Now";
      break;
    case "consideration":
      callToAction = "Get Instant Access to Solve Your Challenges";
      break;
    case "conversion":
      callToAction = "Get the Solution You Need Today";
      break;
    default:
      callToAction = "Download Now";
  }
  
  return {
    id: uuidv4(),
    title,
    description,
    targetAudience: defaultAudience,
    funnelStage,
    format,
    contentOutline,
    estimatedConversionRate,
    implementationSteps,
    callToAction,
    createdAt: new Date()
  };
};
