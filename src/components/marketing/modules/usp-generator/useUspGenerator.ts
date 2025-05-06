
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UspFormData, UspItem } from "./types";
import { useToast } from "@/components/ui/use-toast";

// Mock function to simulate API call for USP generation
const generateMockUsps = (formData: UspFormData): Promise<UspItem[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate 3 USP items based on form data
      const usps: UspItem[] = [
        {
          id: uuidv4(),
          title: `${formData.businessName}: Your Trusted Partner`,
          description: `As the premier solution in the ${formData.industry} industry, ${formData.businessName} addresses the key pain points of ${formData.targetAudience} with unmatched expertise and dedication.`,
          audience: formData.targetAudience,
          supportingPoints: [
            `Industry-leading ${formData.keyFeatures}`,
            `Superior to competitors who struggle with ${formData.competitorWeaknesses}`,
            `Built on core values of ${formData.businessValues.join(", ")}`
          ],
          differentiators: [
            `Unique approach to ${formData.businessStrengths[0] || "quality"}`,
            `Specialized focus on ${formData.customerPainPoints}`,
            `${formData.businessValues[0] || "Reliability"}-first methodology`
          ],
          applicationAreas: [
            "Marketing materials",
            "Website homepage",
            "Sales presentations"
          ],
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          title: `The ${formData.businessName} Difference`,
          description: `Unlike others in the ${formData.industry} space, we specifically designed our solutions to eliminate ${formData.customerPainPoints} for ${formData.targetAudience}.`,
          audience: formData.targetAudience,
          supportingPoints: [
            `${formData.businessStrengths.length > 0 ? formData.businessStrengths[0] : "Excellence"} in every aspect of service`,
            `Direct solution to ${formData.customerPainPoints}`,
            `Features that competitors can't match: ${formData.keyFeatures}`
          ],
          differentiators: [
            `${formData.businessValues.length > 0 ? formData.businessValues[0] : "Innovation"}-driven approach`,
            `Specialized knowledge of ${formData.targetAudience} needs`,
            `Superior alternative to competitors with ${formData.competitorWeaknesses}`
          ],
          applicationAreas: [
            "Email campaigns",
            "Social media messaging",
            "Product packaging"
          ],
          createdAt: new Date()
        },
        {
          id: uuidv4(),
          title: `Why ${formData.targetAudience} Choose ${formData.businessName}`,
          description: `We combine ${formData.keyFeatures} with deep industry expertise to provide a solution that truly understands and addresses the challenges of ${formData.targetAudience}.`,
          audience: formData.targetAudience,
          supportingPoints: [
            `Deep understanding of ${formData.customerPainPoints}`,
            `${formData.businessStrengths.length > 1 ? formData.businessStrengths[1] : "Innovation"} at every step`,
            `${formData.businessValues.length > 1 ? formData.businessValues[1] : "Customer-focus"} in all we do`
          ],
          differentiators: [
            `Addresses ${formData.customerPainPoints} better than alternatives`,
            `Built with ${formData.keyFeatures} that competitors lack`,
            `Founded on ${formData.businessValues.join(" and ")}`
          ],
          applicationAreas: [
            "Customer testimonials",
            "Case studies",
            "Pitch decks"
          ],
          createdAt: new Date()
        }
      ];
      
      resolve(usps);
    }, 2000); // 2 second delay to simulate API call
  });
};

// Default form data
const defaultFormData: UspFormData = {
  businessName: "",
  industry: "",
  targetAudience: "",
  keyFeatures: "",
  competitorWeaknesses: "",
  businessValues: [],
  businessStrengths: [],
  customerPainPoints: ""
};

export const useUspGenerator = () => {
  // State for form data
  const [formData, setFormData] = useState<UspFormData>(defaultFormData);
  
  // State for generated USPs
  const [usps, setUsps] = useState<UspItem[]>([]);
  
  // State for saved USPs
  const [savedUsps, setSavedUsps] = useState<UspItem[]>([]);
  
  // Loading state
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Active tab
  const [activeTab, setActiveTab] = useState("form");
  
  // Toast hook
  const { toast } = useToast();

  // Function to generate USPs
  const generateUsps = async () => {
    // Validate form data
    if (!formData.businessName) {
      setError("Business name is required");
      toast({
        title: "Form Incomplete",
        description: "Please provide your business name",
        variant: "destructive"
      });
      return;
    }

    if (!formData.targetAudience) {
      setError("Target audience is required");
      toast({
        title: "Form Incomplete",
        description: "Please provide your target audience",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      
      // Call the mock API
      const generatedUsps = await generateMockUsps(formData);
      
      // Update state
      setUsps(generatedUsps);
      
      // Switch to results tab
      setActiveTab("results");
      
      toast({
        title: "USPs Generated",
        description: `Generated ${generatedUsps.length} unique selling propositions`,
      });
    } catch (err) {
      setError("Failed to generate USPs. Please try again.");
      toast({
        title: "Generation Failed",
        description: "There was an error generating your USPs",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save a USP
  const saveUsp = (usp: UspItem) => {
    // Check if already saved
    const isAlreadySaved = savedUsps.some(saved => saved.id === usp.id);
    
    if (!isAlreadySaved) {
      setSavedUsps(prev => [...prev, usp]);
      
      toast({
        title: "USP Saved",
        description: `"${usp.title}" has been saved to your collection`,
      });
    } else {
      toast({
        title: "Already Saved",
        description: "This USP is already in your saved collection",
        variant: "destructive"
      });
    }
  };

  // Function to delete a saved USP
  const deleteSavedUsp = (id: string) => {
    setSavedUsps(prev => prev.filter(usp => usp.id !== id));
    
    toast({
      title: "USP Deleted",
      description: "The USP has been removed from your collection",
    });
  };

  // Function to reset the generator
  const resetGenerator = () => {
    setFormData(defaultFormData);
    setUsps([]);
    setActiveTab("form");
  };

  return {
    formData,
    setFormData,
    usps,
    savedUsps,
    isGenerating,
    error,
    activeTab,
    setActiveTab,
    generateUsps,
    saveUsp,
    deleteSavedUsp,
    resetGenerator
  };
};
