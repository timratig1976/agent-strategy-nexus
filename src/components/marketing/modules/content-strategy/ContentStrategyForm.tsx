
import React from "react";
import { ContentPillarFormData } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Plus, X } from "lucide-react";

interface ContentStrategyFormProps {
  formData: ContentPillarFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContentPillarFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

const BRAND_VOICE_OPTIONS = [
  "Professional", "Conversational", "Authoritative", "Educational", 
  "Entertaining", "Inspirational", "Technical", "Friendly"
];

const MARKETING_GOALS = [
  "Brand Awareness", "Lead Generation", "Customer Retention", 
  "Thought Leadership", "SEO Rankings", "Social Engagement"
];

const CONTENT_FORMATS = [
  "Blog Posts", "Videos", "Podcasts", "Infographics", "Ebooks", 
  "Case Studies", "Webinars", "Social Media Posts"
];

const DISTRIBUTION_CHANNELS = [
  "Website/Blog", "Email Newsletter", "LinkedIn", "Twitter", 
  "Facebook", "Instagram", "YouTube", "TikTok", "Industry Publications"
];

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

  // Topic input handling
  const [newTopic, setNewTopic] = React.useState("");
  
  const addTopic = () => {
    if (newTopic.trim() && !formData.keyTopics.includes(newTopic.trim())) {
      setFormData({
        ...formData,
        keyTopics: [...formData.keyTopics, newTopic.trim()]
      });
      setNewTopic("");
    }
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
            
            <div className="space-y-2">
              <Label>Key Topics for Content Pillars *</Label>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Add a topic for a content pillar"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                />
                <Button 
                  type="button"
                  size="sm"
                  onClick={addTopic}
                  disabled={!newTopic.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.keyTopics.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.keyTopics.map((topic) => (
                    <div 
                      key={topic} 
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {topic}
                      <button 
                        type="button" 
                        onClick={() => removeTopic(topic)}
                        className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {formData.keyTopics.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Add at least one topic to generate content pillars
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Brand Voice</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {BRAND_VOICE_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`voice-${option}`}
                      checked={formData.brandVoice.includes(option)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange('brandVoice', option, checked === true)
                      }
                    />
                    <Label htmlFor={`voice-${option}`} className="text-sm font-normal cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="advanced-options">
                <AccordionTrigger className="text-sm font-medium">
                  Advanced Options
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label>Marketing Goals</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {MARKETING_GOALS.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`goal-${goal}`}
                            checked={formData.marketingGoals.includes(goal)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('marketingGoals', goal, checked === true)
                            }
                          />
                          <Label htmlFor={`goal-${goal}`} className="text-sm font-normal cursor-pointer">
                            {goal}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="existingContent">Existing Content Analysis</Label>
                    <Textarea
                      id="existingContent"
                      placeholder="Describe your existing content and what's performed well..."
                      value={formData.existingContent}
                      onChange={(e) => setFormData({...formData, existingContent: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitorInsights">Competitor Content Insights</Label>
                    <Textarea
                      id="competitorInsights"
                      placeholder="What content strategies are your competitors using?"
                      value={formData.competitorInsights}
                      onChange={(e) => setFormData({...formData, competitorInsights: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Content Formats</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {CONTENT_FORMATS.map((format) => (
                        <div key={format} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`format-${format}`}
                            checked={formData.contentFormats.includes(format)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('contentFormats', format, checked === true)
                            }
                          />
                          <Label htmlFor={`format-${format}`} className="text-sm font-normal cursor-pointer">
                            {format}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Distribution Channels</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {DISTRIBUTION_CHANNELS.map((channel) => (
                        <div key={channel} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`channel-${channel}`}
                            checked={formData.distributionChannels.includes(channel)}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange('distributionChannels', channel, checked === true)
                            }
                          />
                          <Label htmlFor={`channel-${channel}`} className="text-sm font-normal cursor-pointer">
                            {channel}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
