
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Persona } from "./types";
import { OutputLanguage } from "@/services/ai/types";
import { MarketingAIService } from "@/services/ai/marketingAIService";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const usePersonaGenerator = () => {
  const { toast } = useToast();
  const { id: strategyId } = useParams<{ id: string }>();
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('english');
  const [industry, setIndustry] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("form");
  
  // Fetch the strategy's language setting if we're in a strategy context
  useEffect(() => {
    const fetchStrategyLanguage = async () => {
      if (strategyId) {
        try {
          const { data, error } = await supabase
            .from('strategies')
            .select('language')
            .eq('id', strategyId)
            .single();
            
          if (error) {
            console.error("Error fetching strategy language:", error);
            return;
          }
          
          // If the language is valid, set it as the output language
          if (data?.language && (data.language === 'english' || data.language === 'deutsch')) {
            setOutputLanguage(data.language as OutputLanguage);
          }
        } catch (err) {
          console.error("Error in fetching strategy language:", err);
        }
      }
    };
    
    fetchStrategyLanguage();
  }, [strategyId]);
  
  const generateProgress = () => {
    // Update progress bar
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 90) {
        currentProgress = 90;
        clearInterval(interval);
      }
      setProgress(Math.min(currentProgress, 90));
    }, 800);
    
    return interval;
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
        throw new Error(outputLanguage === 'deutsch' ? 
          "Bitte füllen Sie alle erforderlichen Felder aus" : 
          "Please fill out all required fields");
      }
      
      const progressInterval = generateProgress();
      
      try {
        // Call the AI service to generate personas using the specified language
        const response = await MarketingAIService.generateContent(
          'persona',
          'generate',
          {
            formData: {
              industry,
              productDescription,
              targetMarket
            },
            strategyId: strategyId // Pass the strategy ID if available
          },
          { outputLanguage }
        );
        
        clearInterval(progressInterval);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Parse the AI response to extract personas
        const generatedContent = response.data?.rawOutput || '';
        
        // For now, we'll use a simplified approach with mock data
        // In a real implementation, this would parse the AI response
        const generatedPersonas: Persona[] = [
          {
            name: outputLanguage === 'deutsch' ? "Sarah Müller" : "Sarah Johnson",
            description: outputLanguage === 'deutsch' 
              ? "Eine vielbeschäftigte Fachkraft, die Effizienz und Qualität schätzt."
              : "A busy professional who values efficiency and quality.",
            photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
            attributes: {
              age: "35-44",
              gender: outputLanguage === 'deutsch' ? "Weiblich" : "Female",
              income: "$75,000 - $100,000",
              education: outputLanguage === 'deutsch' ? "Masterabschluss" : "Master's Degree",
              occupation: outputLanguage === 'deutsch' ? "Marketing Direktor" : "Marketing Director",
              location: outputLanguage === 'deutsch' ? "Städtisch" : "Urban",
              challenges: outputLanguage === 'deutsch' 
                ? ["Begrenzte Zeit für Recherche", "Muss ROI gegenüber der Geschäftsführung nachweisen"]
                : ["Limited time for research", "Needs to demonstrate ROI to executives"],
              goals: outputLanguage === 'deutsch'
                ? ["Marketing-Effizienz steigern", "Markenbekanntheit verbessern"]
                : ["Increase marketing efficiency", "Improve brand visibility"],
              painPoints: outputLanguage === 'deutsch'
                ? ["Zu viele Tools, die nicht gut integriert sind", "Schwierigkeiten bei der Leistungsmessung"]
                : ["Too many tools that don't integrate well", "Difficulty measuring campaign performance"],
              behaviors: outputLanguage === 'deutsch'
                ? ["Recherchiert Lösungen gründlich vor dem Kauf", "Schätzt Empfehlungen von Kollegen"]
                : ["Researches solutions thoroughly before purchase", "Values peer recommendations"],
              mediaPreferences: outputLanguage === 'deutsch'
                ? ["Branchen-Podcasts", "LinkedIn", "Webinare"]
                : ["Industry podcasts", "LinkedIn", "Professional webinars"]
            }
          },
          {
            name: outputLanguage === 'deutsch' ? "Michael Weber" : "Michael Chen",
            description: outputLanguage === 'deutsch'
              ? "Ein technikaffiner Unternehmer auf der Suche nach skalierbaren Lösungen."
              : "A tech-savvy entrepreneur looking for scalable solutions.",
            photoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
            attributes: {
              age: "25-34",
              gender: outputLanguage === 'deutsch' ? "Männlich" : "Male",
              income: "$100,000 - $150,000",
              education: outputLanguage === 'deutsch' ? "Bachelor-Abschluss" : "Bachelor's Degree",
              occupation: outputLanguage === 'deutsch' ? "Startup-Gründer" : "Startup Founder",
              location: outputLanguage === 'deutsch' ? "Vorstädtisch" : "Suburban",
              challenges: outputLanguage === 'deutsch'
                ? ["Wachsende Unternehmen mit begrenzten Ressourcen", "Auf einem wettbewerbsintensiven Markt herausstechen"]
                : ["Growing business with limited resources", "Standing out in a competitive market"],
              goals: outputLanguage === 'deutsch'
                ? ["Geschäft effizient skalieren", "Eine erkennbare Marke aufbauen"]
                : ["Scale business efficiently", "Build a recognizable brand"],
              painPoints: outputLanguage === 'deutsch'
                ? ["Begrenztes Marketingbudget", "Schwierigkeiten, zuverlässige Dienstleister zu finden"]
                : ["Limited marketing budget", "Difficulty finding reliable service providers"],
              behaviors: outputLanguage === 'deutsch'
                ? ["Früher Anwender neuer Technologien", "Trifft schnelle Entscheidungen basierend auf Daten"]
                : ["Early adopter of new technologies", "Makes quick decisions based on data"],
              mediaPreferences: outputLanguage === 'deutsch'
                ? ["Tech-Blogs", "Twitter", "YouTube-Tutorials", "Branchenforen"]
                : ["Tech blogs", "Twitter", "YouTube tutorials", "Industry forums"]
            }
          }
        ];
        
        setPersonas(generatedPersonas);
        setProgress(100);
        setActiveTab("results");
        
        toast({
          title: outputLanguage === 'deutsch' ? "Personas generiert" : "Personas generated",
          description: outputLanguage === 'deutsch' 
            ? `${generatedPersonas.length} Käuferpersonas basierend auf Ihrer Eingabe erstellt`
            : `Created ${generatedPersonas.length} buyer personas based on your input`,
        });
      } catch (apiError: any) {
        clearInterval(progressInterval);
        throw apiError;
      }
      
    } catch (error: any) {
      console.error("Error generating personas:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsLoading(false);
      toast({
        title: outputLanguage === 'deutsch' ? "Generierung fehlgeschlagen" : "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate personas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
