
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
    result,
    isLoading,
    isSaving,
    error,
    handleSubmit,
    saveCreative,
    deleteSavedCreative,
    resetGenerator,
    savedCreatives
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

      <Tabs defaultValue="form">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="form">Generator</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
          <TabsTrigger value="saved">Saved Creatives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <AdCreativeForm 
            formData={formData}
            setFormData={setFormData}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="results">
          {result ? (
            <AdCreativeResults
              result={result}
              onSave={() => saveCreative(result)}
              onReset={resetGenerator}
              isSaving={isSaving}
            />
          ) : (
            <div className="text-center p-12 text-muted-foreground">
              Generate an ad creative to see results here.
            </div>
          )}
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
