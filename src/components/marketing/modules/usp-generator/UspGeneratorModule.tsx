
import React from "react";
import { Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UspGeneratorForm from "./UspGeneratorForm";
import UspGeneratorResults from "./UspGeneratorResults";
import SavedUsps from "./SavedUsps";
import { useUspGenerator } from "./useUspGenerator";

const UspGeneratorModule = () => {
  const {
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
  } = useUspGenerator();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">USP Generator</h2>
          <p className="text-muted-foreground mt-1">
            Create compelling unique selling propositions that differentiate your business
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="form">Generator</TabsTrigger>
          <TabsTrigger value="results" disabled={usps.length === 0}>Results</TabsTrigger>
          <TabsTrigger value="saved">Saved USPs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <UspGeneratorForm 
            formData={formData}
            setFormData={setFormData}
            onGenerate={generateUsps}
            isGenerating={isGenerating}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="results">
          <UspGeneratorResults
            usps={usps}
            onSave={saveUsp}
            onBack={resetGenerator}
          />
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedUsps 
            savedUsps={savedUsps}
            onDelete={deleteSavedUsp}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UspGeneratorModule;
