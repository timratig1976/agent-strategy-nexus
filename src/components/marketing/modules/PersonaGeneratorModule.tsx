
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, AlertCircle, Download } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PersonaAttributes {
  age: string;
  gender: string;
  income: string;
  education: string;
  occupation: string;
  location: string;
  challenges: string[];
  goals: string[];
  painPoints: string[];
  behaviors: string[];
  mediaPreferences: string[];
}

interface Persona {
  name: string;
  description: string;
  photoUrl?: string;
  attributes: PersonaAttributes;
}

const PersonaGeneratorModule = () => {
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

  const handleDownload = (persona: Persona) => {
    // In a real implementation, this would generate a PDF or other downloadable format
    toast({
      title: "Persona downloaded",
      description: `${persona.name} persona has been downloaded`,
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Persona Generator</h2>
          <p className="text-muted-foreground mt-1">
            Create detailed buyer personas for your target audience
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="form">Create Personas</TabsTrigger>
          <TabsTrigger value="results" disabled={personas.length === 0 && !isLoading}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Create Buyer Personas</CardTitle>
                <CardDescription>
                  Provide information about your business to generate detailed buyer personas
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Software, Healthcare, Retail"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-description">Product or Service Description</Label>
                  <Textarea
                    id="product-description"
                    placeholder="Describe your product or service in detail"
                    rows={4}
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target-market">Target Market</Label>
                  <Textarea
                    id="target-market"
                    placeholder="Describe who you think your ideal customers are"
                    rows={3}
                    value={targetMarket}
                    onChange={(e) => setTargetMarket(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="persona-count">Number of Personas</Label>
                  <Select defaultValue="2" disabled={isLoading}>
                    <SelectTrigger id="persona-count">
                      <SelectValue placeholder="Select number of personas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Persona</SelectItem>
                      <SelectItem value="2">2 Personas</SelectItem>
                      <SelectItem value="3">3 Personas</SelectItem>
                      <SelectItem value="4">4 Personas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Generating personas...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Personas"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Generated Personas</h3>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Create New Personas
              </Button>
            </div>
            
            {personas.map((persona, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    {persona.photoUrl && (
                      <div className="h-16 w-16 rounded-full overflow-hidden">
                        <img 
                          src={persona.photoUrl} 
                          alt={persona.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <CardTitle>{persona.name}</CardTitle>
                      <CardDescription className="mt-1">{persona.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Demographics</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span>{persona.attributes.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gender:</span>
                          <span>{persona.attributes.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Income:</span>
                          <span>{persona.attributes.income}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Education:</span>
                          <span>{persona.attributes.education}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Occupation:</span>
                          <span>{persona.attributes.occupation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span>{persona.attributes.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Goals</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {persona.attributes.goals.map((goal, idx) => (
                            <li key={idx}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Pain Points</h4>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {persona.attributes.painPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Behaviors</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {persona.attributes.behaviors.map((behavior, idx) => (
                          <li key={idx}>{behavior}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Media Preferences</h4>
                      <div className="flex flex-wrap gap-2">
                        {persona.attributes.mediaPreferences.map((media, idx) => (
                          <div key={idx} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                            {media}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleDownload(persona)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Persona
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonaGeneratorModule;
