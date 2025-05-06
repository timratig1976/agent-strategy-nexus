
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
    adCreatives,
    savedCreatives,
    isLoading,
    isSaving,
    error,
    activeTab,
    setActiveTab,
    handleSubmit,
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
            isLoading={isLoading}
            onSubmit={handleSubmit}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="results">
          {result ? (
            <AdCreativeResults
              result={result}
              onSave={saveCreative}
              onReset={resetGenerator}
              isSaving={isSaving}
            />
          ) : (
            <div className="space-y-6">
              {adCreatives.map((creative, index) => (
                <AdCreativeResults
                  key={index}
                  result={creative}
                  onSave={() => saveCreative(creative)}
                  onReset={resetGenerator}
                  isSaving={isSaving}
                />
              ))}
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
