
import React from "react";
import { FileText } from "lucide-react";
import { useContentStrategy } from "./useContentStrategy";
import ContentStrategyForm from "./ContentStrategyForm";
import ContentStrategyResults from "./ContentStrategyResults";

const ContentStrategyModule = () => {
  const { 
    formData, 
    setFormData, 
    contentPillars, 
    isGenerating, 
    error,
    activeTab,
    generateContentPillars,
    savePillar,
    resetGenerator
  } = useContentStrategy();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateContentPillars();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Content Pillar Strategy</h2>
          <p className="text-muted-foreground mt-1">
            Generate a complete content pillar strategy with cluster content ideas
          </p>
        </div>
      </div>

      {activeTab === "form" && (
        <ContentStrategyForm
          formData={formData}
          setFormData={setFormData}
          isGenerating={isGenerating}
          error={error}
          onSubmit={handleSubmit}
        />
      )}

      {activeTab === "results" && contentPillars.length > 0 && (
        <ContentStrategyResults
          pillar={contentPillars[0]}
          onReset={resetGenerator}
          onSave={() => savePillar(contentPillars[0])}
        />
      )}
    </div>
  );
};

export default ContentStrategyModule;
