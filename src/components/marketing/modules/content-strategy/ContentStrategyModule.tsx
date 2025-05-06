
import React from "react";
import { Book } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentStrategyForm from "./ContentStrategyForm";
import ContentStrategyResults from "./ContentStrategyResults";
import SavedContentPillars from "./SavedContentPillars";
import { useContentStrategy } from "./useContentStrategy";

const ContentStrategyModule = () => {
  const {
    formData,
    setFormData,
    contentPillars,
    savedPillars,
    isGenerating,
    error,
    activeTab,
    setActiveTab,
    generateContentPillars,
    savePillar,
    deleteSavedPillar,
    resetGenerator
  } = useContentStrategy();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Book className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Content Pillar Strategy</h2>
          <p className="text-muted-foreground mt-1">
            Build a comprehensive content strategy organized around core topics
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="form">Generator</TabsTrigger>
          <TabsTrigger value="results" disabled={contentPillars.length === 0}>Results</TabsTrigger>
          <TabsTrigger value="saved">Saved Pillars</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <ContentStrategyForm 
            formData={formData}
            setFormData={setFormData}
            onGenerate={generateContentPillars}
            isGenerating={isGenerating}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="results">
          <ContentStrategyResults
            contentPillars={contentPillars}
            onSave={savePillar}
            onBack={resetGenerator}
          />
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedContentPillars 
            savedPillars={savedPillars}
            onDelete={deleteSavedPillar}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentStrategyModule;
