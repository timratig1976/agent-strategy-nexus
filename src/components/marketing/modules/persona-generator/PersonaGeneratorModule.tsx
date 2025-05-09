
import React from "react";
import { User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonaForm from "./PersonaForm";
import PersonaResultsList from "./PersonaResultsList";
import { usePersonaGenerator } from "./usePersonaGenerator";

const PersonaGeneratorModule = () => {
  // Remove language state and selector, use the language from the strategy settings
  const { 
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
  } = usePersonaGenerator();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center">
        <div className="flex items-center space-x-3">
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="form">Create Personas</TabsTrigger>
          <TabsTrigger value="results" disabled={personas.length === 0 && !isLoading}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <PersonaForm 
            industry={industry}
            setIndustry={setIndustry}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            targetMarket={targetMarket}
            setTargetMarket={setTargetMarket}
            isLoading={isLoading}
            progress={progress}
            error={error}
            handleSubmit={handleSubmit}
          />
        </TabsContent>
        
        <TabsContent value="results">
          <PersonaResultsList personas={personas} handleReset={handleReset} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonaGeneratorModule;
