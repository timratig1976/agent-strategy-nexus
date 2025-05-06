
import React from "react";
import { AdCreativeFormData } from "./types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";

interface AdCreativeFormProps {
  formData: AdCreativeFormData;
  setFormData: React.Dispatch<React.SetStateAction<AdCreativeFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

const AD_PLATFORMS = [
  { label: "Facebook", value: "Facebook" },
  { label: "Instagram", value: "Instagram" },
  { label: "LinkedIn", value: "LinkedIn" },
  { label: "Google Ads", value: "Google Ads" },
  { label: "Twitter", value: "Twitter" },
  { label: "TikTok", value: "TikTok" },
  { label: "YouTube", value: "YouTube" },
  { label: "Pinterest", value: "Pinterest" }
];

const CAMPAIGN_OBJECTIVES = [
  { label: "Brand Awareness", value: "brand_awareness" },
  { label: "Lead Generation", value: "lead_generation" },
  { label: "Conversions", value: "conversions" },
  { label: "Engagement", value: "engagement" },
  { label: "Traffic", value: "traffic" },
  { label: "App Installs", value: "app_installs" }
];

const KEY_BENEFITS = [
  { label: "Saves Time", value: "saves_time" },
  { label: "Reduces Costs", value: "reduces_costs" },
  { label: "Improves Quality", value: "improves_quality" },
  { label: "Increases Efficiency", value: "increases_efficiency" },
  { label: "Enhances Experience", value: "enhances_experience" },
  { label: "Solves Problem", value: "solves_problem" },
  { label: "Prevents Issues", value: "prevents_issues" },
  { label: "Exclusive Features", value: "exclusive_features" }
];

const CALL_TO_ACTIONS = [
  { label: "Learn More", value: "Learn More" },
  { label: "Shop Now", value: "Shop Now" },
  { label: "Sign Up", value: "Sign Up" },
  { label: "Get Started", value: "Get Started" },
  { label: "Book Demo", value: "Book Demo" },
  { label: "Download Now", value: "Download Now" },
  { label: "Contact Us", value: "Contact Us" },
  { label: "Subscribe", value: "Subscribe" }
];

const AdCreativeForm = ({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  error
}: AdCreativeFormProps) => {
  const handlePlatformChange = (value: string, checked: CheckedState) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        adPlatforms: [...prev.adPlatforms, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        adPlatforms: prev.adPlatforms.filter(platform => platform !== value)
      }));
    }
  };

  const handleBenefitChange = (value: string, checked: CheckedState) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        keyBenefits: [...prev.keyBenefits, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        keyBenefits: prev.keyBenefits.filter(benefit => benefit !== value)
      }));
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-950">
      <CardContent className="pt-6">
        {error && (
          <div className="mb-4 p-3 border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-red-700 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productService">Product/Service Name *</Label>
              <Input
                id="productService"
                placeholder="e.g., Cloud Software, Fitness Program"
                value={formData.productService}
                onChange={e => setFormData(prev => ({ ...prev, productService: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaignObjective">Campaign Objective *</Label>
              <Select 
                value={formData.campaignObjective} 
                onValueChange={value => setFormData(prev => ({ ...prev, campaignObjective: value }))}
              >
                <SelectTrigger id="campaignObjective">
                  <SelectValue placeholder="Select an objective" />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_OBJECTIVES.map(objective => (
                    <SelectItem key={objective.value} value={objective.value}>
                      {objective.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience *</Label>
            <Textarea
              id="targetAudience"
              placeholder="Describe who your ad targets (e.g., Small business owners aged 30-45 interested in productivity)"
              value={formData.targetAudience}
              onChange={e => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <Label>Ad Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AD_PLATFORMS.map(platform => (
                <div key={platform.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`platform-${platform.value}`} 
                    checked={formData.adPlatforms.includes(platform.value)}
                    onCheckedChange={(checked) => 
                      handlePlatformChange(platform.value, checked)
                    }
                  />
                  <label 
                    htmlFor={`platform-${platform.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {platform.label}
                  </label>
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
                <div className="space-y-3">
                  <Label>Key Benefits</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {KEY_BENEFITS.map(benefit => (
                      <div key={benefit.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`benefit-${benefit.value}`} 
                          checked={formData.keyBenefits.includes(benefit.value)}
                          onCheckedChange={(checked) => 
                            handleBenefitChange(benefit.value, checked)
                          }
                        />
                        <label 
                          htmlFor={`benefit-${benefit.value}`}
                          className="text-sm cursor-pointer"
                        >
                          {benefit.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brandTone">Brand Tone</Label>
                    <Select 
                      value={formData.brandTone} 
                      onValueChange={value => setFormData(prev => ({ ...prev, brandTone: value }))}
                    >
                      <SelectTrigger id="brandTone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Friendly">Friendly</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Humorous">Humorous</SelectItem>
                        <SelectItem value="Authoritative">Authoritative</SelectItem>
                        <SelectItem value="Inspirational">Inspirational</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="callToAction">Call to Action</Label>
                    <Select 
                      value={formData.callToAction} 
                      onValueChange={value => setFormData(prev => ({ ...prev, callToAction: value }))}
                    >
                      <SelectTrigger id="callToAction">
                        <SelectValue placeholder="Select CTA" />
                      </SelectTrigger>
                      <SelectContent>
                        {CALL_TO_ACTIONS.map(cta => (
                          <SelectItem key={cta.value} value={cta.value}>
                            {cta.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any specific requirements, brand guidelines, or other details..."
                    value={formData.additionalNotes}
                    onChange={e => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t p-6">
        <Button 
          onClick={onGenerate} 
          disabled={isGenerating}
          className="w-full md:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Creatives...
            </>
          ) : (
            "Generate Ad Creatives"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdCreativeForm;
