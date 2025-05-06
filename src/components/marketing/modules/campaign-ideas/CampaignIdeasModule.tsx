
import React from "react";
import { Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CampaignIdeaForm from "./CampaignIdeaForm";
import CampaignIdeaResults from "./CampaignIdeaResults";
import SavedCampaignIdeas from "./SavedCampaignIdeas";
import { useCampaignIdeas } from "./useCampaignIdeas";

const CampaignIdeasModule = () => {
  const {
    formData,
    setFormData,
    campaignIdeas,
    savedIdeas,
    isGenerating,
    error,
    activeTab,
    setActiveTab,
    generateCampaignIdeas,
    saveIdea,
    deleteSavedIdea,
    resetGenerator
  } = useCampaignIdeas();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Lightbulb className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Campaign Idea Generator</h2>
          <p className="text-muted-foreground mt-1">
            Generate innovative marketing campaign concepts tailored to your business goals
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="form">Generator</TabsTrigger>
          <TabsTrigger value="results" disabled={campaignIdeas.length === 0}>Results</TabsTrigger>
          <TabsTrigger value="saved">Saved Ideas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <CampaignIdeaForm 
            formData={formData}
            setFormData={setFormData}
            onGenerate={generateCampaignIdeas}
            isGenerating={isGenerating}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="results">
          <CampaignIdeaResults
            campaignIdeas={campaignIdeas}
            onSave={saveIdea}
            onBack={resetGenerator}
          />
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedCampaignIdeas 
            savedIdeas={savedIdeas}
            onDelete={deleteSavedIdea}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignIdeasModule;
