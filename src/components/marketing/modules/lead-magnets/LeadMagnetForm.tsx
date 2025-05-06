
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { LeadMagnetFormData } from "./types";

interface LeadMagnetFormProps {
  formData: LeadMagnetFormData;
  setFormData: React.Dispatch<React.SetStateAction<LeadMagnetFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

const LeadMagnetForm = ({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  error
}: LeadMagnetFormProps) => {
  const updateFormField = (field: keyof LeadMagnetFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateCheckboxArray = (field: keyof LeadMagnetFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = Array.isArray(prev[field]) ? [...prev[field]] as string[] : [];
      
      if (checked) {
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  const marketingGoalsOptions = [
    { label: "Increase brand awareness", value: "awareness" },
    { label: "Generate leads", value: "leads" },
    { label: "Nurture prospects", value: "nurture" },
    { label: "Convert customers", value: "convert" },
    { label: "Retain customers", value: "retain" }
  ];

  const brandVoiceOptions = [
    { label: "Professional", value: "professional" },
    { label: "Casual", value: "casual" },
    { label: "Technical", value: "technical" },
    { label: "Educational", value: "educational" },
    { label: "Conversational", value: "conversational" }
  ];

  const funnelStageOptions = [
    { label: "Top of funnel (Awareness)", value: "awareness" },
    { label: "Middle of funnel (Consideration)", value: "consideration" },
    { label: "Bottom of funnel (Conversion)", value: "conversion" }
  ];

  const contentFormatOptions = [
    { label: "eBook", value: "ebook" },
    { label: "Webinar", value: "webinar" },
    { label: "Checklist", value: "checklist" },
    { label: "Template", value: "template" },
    { label: "Case Study", value: "case_study" },
    { label: "White Paper", value: "white_paper" },
    { label: "Email Course", value: "email_course" },
    { label: "Video Tutorial", value: "video_tutorial" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Business Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessType">Type of Business/Industry</Label>
            <Input
              id="businessType"
              placeholder="e.g., Marketing Agency, SaaS Platform, Healthcare Provider"
              value={formData.businessType}
              onChange={(e) => updateFormField("businessType", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Small Business Owners, Marketing Professionals, HR Managers"
              value={formData.targetAudience}
              onChange={(e) => updateFormField("targetAudience", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="problemSolving">Problem Your Business Solves</Label>
            <Textarea
              id="problemSolving"
              placeholder="Describe the main problem(s) your product or service addresses"
              value={formData.problemSolving}
              onChange={(e) => updateFormField("problemSolving", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Lead Magnet Strategy</h3>
        <div className="space-y-6">
          <CheckboxGroup
            label="Marketing Goals"
            options={marketingGoalsOptions}
            values={Array.isArray(formData.marketingGoals) ? formData.marketingGoals : []}
            onChange={(value, checked) => updateCheckboxArray("marketingGoals", value, checked)}
          />

          <div>
            <Label htmlFor="existingContent">Existing Content to Repurpose (Optional)</Label>
            <Textarea
              id="existingContent"
              placeholder="Describe any existing content that could be repurposed for lead magnets"
              value={formData.existingContent}
              onChange={(e) => updateFormField("existingContent", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <CheckboxGroup
            label="Brand Voice"
            options={brandVoiceOptions}
            values={Array.isArray(formData.brandVoice) ? formData.brandVoice : []}
            onChange={(value, checked) => updateCheckboxArray("brandVoice", value, checked)}
          />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Content Specifications</h3>
        <div className="space-y-6">
          <CheckboxGroup
            label="Marketing Funnel Stage"
            options={funnelStageOptions}
            values={Array.isArray(formData.funnelStage) ? formData.funnelStage : []}
            onChange={(value, checked) => updateCheckboxArray("funnelStage", value, checked)}
          />

          <CheckboxGroup
            label="Preferred Content Formats"
            options={contentFormatOptions}
            values={Array.isArray(formData.contentFormats) ? formData.contentFormats : []}
            onChange={(value, checked) => updateCheckboxArray("contentFormats", value, checked)}
          />
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Lead Magnet Ideas"
          )}
        </Button>
      </div>
    </form>
  );
};

export default LeadMagnetForm;
