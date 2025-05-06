
import React from "react";
import { Book, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useContentStrategy } from "./useContentStrategy";
import ContentStrategyForm from "./ContentStrategyForm";
import ContentStrategyResults from "./ContentStrategyResults";
import SavedContentPillars from "./SavedContentPillars";

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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Book className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Content Pillar Strategy</h2>
          <p className="text-muted-foreground mt-1">
            Develop a comprehensive content pillar strategy for your brand
          </p>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={resetGenerator}
            className="flex items-center space-x-2"
            disabled={isGenerating || activeTab === "form"}
          >
            <RotateCcw className="h-4 w-4" />
            <span>New Strategy</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="form">Define Strategy</TabsTrigger>
          <TabsTrigger value="results" disabled={contentPillars.length === 0}>
            Generated Pillars
          </TabsTrigger>
          <TabsTrigger value="saved">Saved Pillars</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          <ContentStrategyForm
            formData={formData}
            setFormData={setFormData}
            onGenerate={generateContentPillars}
            isGenerating={isGenerating}
            error={error}
          />
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <ContentStrategyResults
            contentPillars={contentPillars}
            onSave={savePillar}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
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
