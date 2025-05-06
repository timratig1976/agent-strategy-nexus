
import React from "react";
import { Book, RotateCcw, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLeadMagnets } from "./useLeadMagnets";
import LeadMagnetForm from "./LeadMagnetForm";
import LeadMagnetResults from "./LeadMagnetResults";
import SavedLeadMagnets from "./SavedLeadMagnets";

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
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Book className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Lead Magnet Generator</h2>
          <p className="text-muted-foreground mt-1">
            Create compelling lead generation content tailored to your audience and business goals
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
            <span>New Generation</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="form">Define Requirements</TabsTrigger>
          <TabsTrigger value="results" disabled={leadMagnets.length === 0}>
            Generated Ideas
          </TabsTrigger>
          <TabsTrigger value="saved">Saved Lead Magnets</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          <LeadMagnetForm
            formData={formData}
            setFormData={setFormData}
            onGenerate={generateLeadMagnets}
            isGenerating={isGenerating}
            error={error}
          />
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <LeadMagnetResults
            leadMagnets={leadMagnets}
            onSave={saveMagnet}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
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
