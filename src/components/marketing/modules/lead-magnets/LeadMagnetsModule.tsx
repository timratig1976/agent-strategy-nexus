
import React from "react";
import { Book, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadMagnetForm from "./LeadMagnetForm";
import LeadMagnetResults from "./LeadMagnetResults";
import SavedLeadMagnets from "./SavedLeadMagnets";
import { useLeadMagnets } from "./useLeadMagnets";

const LeadMagnetsModule = () => {
  const {
    formData,
    setFormData,
    leadMagnets,
    savedMagnets,
    isGenerating,
    error,
    activeTab,
    setActiveTab,
    generateLeadMagnets,
    saveMagnet,
    deleteSavedMagnet,
    resetGenerator
  } = useLeadMagnets();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Target className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Lead Magnet Generator</h2>
          <p className="text-muted-foreground mt-1">
            Create compelling lead magnets to attract prospects and build your audience
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="form">Generator</TabsTrigger>
          <TabsTrigger value="results" disabled={leadMagnets.length === 0}>Results</TabsTrigger>
          <TabsTrigger value="saved">Saved Lead Magnets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <LeadMagnetForm 
            formData={formData}
            setFormData={setFormData}
            onGenerate={generateLeadMagnets}
            isGenerating={isGenerating}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="results">
          <LeadMagnetResults
            leadMagnets={leadMagnets}
            onSave={saveMagnet}
            onBack={resetGenerator}
          />
        </TabsContent>
        
        <TabsContent value="saved">
          <SavedLeadMagnets 
            savedMagnets={savedMagnets}
            onDelete={deleteSavedMagnet}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadMagnetsModule;
