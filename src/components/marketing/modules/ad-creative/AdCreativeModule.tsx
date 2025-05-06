
import React from "react";
import { Image } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdCreativeForm from "./AdCreativeForm";
import AdCreativeResults from "./AdCreativeResults";
import SavedAdCreatives from "./SavedAdCreatives";
import { useAdCreative } from "./useAdCreative";

const AdCreativeModule = () => {
  const {
    formData,
    setFormData,
    adCreatives,
    savedCreatives,
    isGenerating,
    error,
    activeTab,
    setActiveTab,
    generateAdCreatives,
    saveCreative,
    deleteSavedCreative,
    resetGenerator
  } = useAdCreative();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Image className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Ad Creative Generator</h2>
          <p className="text-muted-foreground mt-1">
            Generate compelling text and visual ad creatives for your marketing campaigns
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="form">Generator</TabsTrigger>
          <TabsTrigger value="results" disabled={adCreatives.length === 0}>Results</TabsTrigger>
          <TabsTrigger value="saved">Saved Creatives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <AdCreativeForm 
            formData={formData}
            setFormData={setFormData}
            onGenerate={generateAdCreatives}
            isGenerating={isGenerating}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="results">
          <AdCreativeResults
            adCreatives={adCreatives}
            onSave={saveCreative}
            onBack={resetGenerator}
          />
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedAdCreatives 
            savedCreatives={savedCreatives}
            onDelete={deleteSavedCreative}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdCreativeModule;
