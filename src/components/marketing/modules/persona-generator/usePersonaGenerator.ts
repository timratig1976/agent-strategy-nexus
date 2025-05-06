
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Persona } from "./types";

export const usePersonaGenerator = () => {
  const { toast } = useToast();
  const [industry, setIndustry] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("form");
  
  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // Simulate completion after full progress
        setTimeout(() => {
          const generatedPersonas: Persona[] = [
            {
              name: "Sarah Johnson",
              description: "A busy professional who values efficiency and quality.",
              photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
              attributes: {
                age: "35-44",
                gender: "Female",
                income: "$75,000 - $100,000",
                education: "Master's Degree",
                occupation: "Marketing Director",
                location: "Urban",
                challenges: [
                  "Limited time for research",
                  "Needs to demonstrate ROI to executives",
                  "Managing diverse marketing channels"
                ],
                goals: [
                  "Increase marketing efficiency",
                  "Improve brand visibility",
                  "Develop data-driven strategies"
                ],
                painPoints: [
                  "Too many tools that don't integrate well",
                  "Difficulty measuring campaign performance",
                  "Balancing creativity with analytics"
                ],
                behaviors: [
                  "Researches solutions thoroughly before purchase",
                  "Values peer recommendations",
                  "Mobile-first, always connected"
                ],
                mediaPreferences: [
                  "Industry podcasts",
                  "LinkedIn",
                  "Professional webinars",
                  "Email newsletters"
                ]
              }
            },
            {
              name: "Michael Chen",
              description: "A tech-savvy entrepreneur looking for scalable solutions.",
              photoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
              attributes: {
                age: "25-34",
                gender: "Male",
                income: "$100,000 - $150,000",
                education: "Bachelor's Degree",
                occupation: "Startup Founder",
                location: "Suburban",
                challenges: [
                  "Growing business with limited resources",
                  "Standing out in a competitive market",
                  "Balancing innovation with stability"
                ],
                goals: [
                  "Scale business efficiently",
                  "Build a recognizable brand",
                  "Leverage technology for competitive advantage"
                ],
                painPoints: [
                  "Limited marketing budget",
                  "Difficulty finding reliable service providers",
                  "Too many decisions to make daily"
                ],
                behaviors: [
                  "Early adopter of new technologies",
                  "Makes quick decisions based on data",
                  "Values flexibility and customization"
                ],
                mediaPreferences: [
                  "Tech blogs",
                  "Twitter",
                  "YouTube tutorials",
                  "Industry forums"
                ]
              }
            }
          ];
          
          setPersonas(generatedPersonas);
          setIsLoading(false);
          setActiveTab("results");
          toast({
            title: "Personas generated",
            description: `Created ${generatedPersonas.length} buyer personas based on your input`,
          });
        }, 500);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPersonas([]);
    setIsLoading(true);
    setProgress(0);
    
    try {
      // Validate form
      if (!industry || !productDescription || !targetMarket) {
        throw new Error("Please fill out all required fields");
      }
      
      // In a real implementation, we'd call a backend service/AI to generate personas
      // For now, we'll simulate the persona generation process
      simulateProgress();
      
    } catch (error) {
      console.error("Error generating personas:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsLoading(false);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate personas",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setActiveTab("form");
  };

  return {
    industry,
    setIndustry,
    productDescription,
    setProductDescription,
    targetMarket,
    setTargetMarket,
    isLoading,
    progress,
    personas,
    error,
    activeTab,
    setActiveTab,
    handleSubmit,
    handleReset
  };
};
