
import React from "react";
import { ContentStrategyFormData, ContentStrategyFormProps } from "./types";
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

const ContentStrategyForm = ({
  formData,
  setFormData,
  onSubmit,
  isGenerating,
  error
}: ContentStrategyFormProps) => {
  // Array option handlers
  const handleCheckboxChange = (
    field: keyof ContentStrategyFormData,
    value: string,
    isChecked: boolean
  ) => {
    if (field === 'tone') {
      // Handle tone as a single string value
      if (isChecked) {
        setFormData({
          ...formData,
          tone: value
        });
      }
    } else {
      // Handle array fields properly
      const currentValues = formData[field] as string[] || [];
      
      if (isChecked) {
        setFormData({
          ...formData,
          [field]: [...currentValues, value]
        });
      } else {
        setFormData({
          ...formData,
          [field]: (currentValues).filter(item => item !== value)
        });
      }
    }
  };

  const addTopic = (topic: string) => {
    setFormData({
      ...formData,
      keyword: topic
    });
  };

  const removeTopic = (topic: string) => {
    setFormData({
      ...formData,
      keyword: ""
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-950">
      <form onSubmit={onSubmit}>
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
                  value={formData.businessGoals}
                  onChange={(e) => setFormData({...formData, businessGoals: e.target.value})}
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
              topics={[formData.keyword]}
              onAddTopic={addTopic}
              onRemoveTopic={removeTopic}
            />

            <BrandVoiceSelector 
              selectedVoices={formData.tone ? [formData.tone] : []} 
              onChange={(field, value, isChecked) => handleCheckboxChange('tone', value, isChecked)}
            />

            <AdvancedOptions
              formData={{
                marketingGoals: formData.marketingGoals || [],
                existingContent: formData.existingContent || "",
                competitorInsights: formData.competitorInsights || "",
                contentFormats: formData.contentFormats || [],
                distributionChannels: formData.distributionChannels || []
              }}
              setFormData={(advancedData) => setFormData({...formData, ...advancedData})}
              handleCheckboxChange={handleCheckboxChange}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end border-t p-6">
          <Button 
            type="submit" 
            disabled={isGenerating || !formData.keyword}
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
