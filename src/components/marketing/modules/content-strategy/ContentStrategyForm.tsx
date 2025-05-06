
import React from "react";
import { ContentPillarFormData } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import BrandVoiceSelector from "./components/BrandVoiceSelector";
import TopicInput from "./components/TopicInput";
import AdvancedOptions from "./components/AdvancedOptions";

interface ContentStrategyFormProps {
  formData: ContentPillarFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentPillarFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

const ContentStrategyForm = ({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  error
}: ContentStrategyFormProps) => {
  // Array option handlers
  const handleCheckboxChange = (
    field: keyof ContentPillarFormData,
    value: string,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field] as string[], value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter(item => item !== value)
      }));
    }
  };

  const addTopic = (topic: string) => {
    setFormData({
      ...formData,
      keyTopics: [...formData.keyTopics, topic]
    });
  };

  const removeTopic = (topic: string) => {
    setFormData({
      ...formData,
      keyTopics: formData.keyTopics.filter(t => t !== topic)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <Card className="bg-white dark:bg-gray-950">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-3 border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="businessNiche">Business Niche/Industry *</Label>
                <Input
                  id="businessNiche"
                  placeholder="e.g., Digital Marketing, Healthcare, SaaS"
                  value={formData.businessNiche}
                  onChange={(e) => setFormData({...formData, businessNiche: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target Audience *</Label>
                <Input
                  id="targetAudience"
                  placeholder="e.g., Marketing professionals, Small business owners"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <TopicInput 
              topics={formData.keyTopics}
              onAddTopic={addTopic}
              onRemoveTopic={removeTopic}
            />

            <BrandVoiceSelector 
              selectedVoices={formData.brandVoice} 
              onChange={handleCheckboxChange}
            />

            <AdvancedOptions
              formData={formData}
              setFormData={setFormData}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end border-t p-6">
          <Button 
            type="submit" 
            disabled={isGenerating || formData.keyTopics.length === 0}
            className="w-full md:w-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Content Strategy...
              </>
            ) : (
              "Generate Content Strategy"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ContentStrategyForm;
