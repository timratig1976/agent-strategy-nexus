
import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { LeadMagnetFormData } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

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
  // Available options for multiselect fields
  const marketingGoalsOptions = [
    { id: "lead_generation", label: "Lead Generation" },
    { id: "email_list_building", label: "Email List Building" },
    { id: "audience_education", label: "Audience Education" },
    { id: "establish_authority", label: "Establish Authority" },
    { id: "increase_sales", label: "Increase Sales" },
    { id: "customer_retention", label: "Customer Retention" }
  ];

  const brandVoiceOptions = [
    { id: "professional", label: "Professional" },
    { id: "friendly", label: "Friendly" },
    { id: "authoritative", label: "Authoritative" },
    { id: "innovative", label: "Innovative" },
    { id: "educational", label: "Educational" },
    { id: "conversational", label: "Conversational" }
  ];

  const funnelStageOptions = [
    { id: "awareness", label: "Awareness (Top of Funnel)" },
    { id: "consideration", label: "Consideration (Middle of Funnel)" },
    { id: "conversion", label: "Conversion (Bottom of Funnel)" },
    { id: "retention", label: "Retention (Existing Customers)" }
  ];

  const contentFormatOptions = [
    { id: "ebook", label: "eBook / Guide" },
    { id: "checklist", label: "Checklist" },
    { id: "template", label: "Template / Worksheet" },
    { id: "webinar", label: "Webinar / Workshop" },
    { id: "case_study", label: "Case Study" },
    { id: "video_series", label: "Video Series" },
    { id: "email_course", label: "Email Course" },
    { id: "quiz", label: "Quiz / Assessment" }
  ];

  const handleCheckboxChange = (
    field: keyof Pick<LeadMagnetFormData, "marketingGoals" | "brandVoice" | "funnelStage" | "contentFormats">,
    itemId: string,
    checked: boolean
  ) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          [field]: [...prev[field], itemId]
        };
      } else {
        return {
          ...prev,
          [field]: prev[field].filter(id => id !== itemId)
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Business Information</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="businessType">Business Type/Industry</Label>
            <Input
              id="businessType"
              placeholder="e.g., SaaS, E-commerce, Health & Wellness"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Small Business Owners, Marketing Professionals"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="problemSolving">Problem Your Business Solves</Label>
            <Textarea
              id="problemSolving"
              placeholder="Describe the main problem or challenge your product/service solves"
              value={formData.problemSolving}
              onChange={(e) => setFormData({ ...formData, problemSolving: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Lead Magnet Requirements</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Marketing Goals (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {marketingGoalsOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${option.id}`}
                    checked={formData.marketingGoals.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("marketingGoals", option.id, checked === true)
                    }
                  />
                  <Label htmlFor={`goal-${option.id}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Brand Voice (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {brandVoiceOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`voice-${option.id}`}
                    checked={formData.brandVoice.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("brandVoice", option.id, checked === true)
                    }
                  />
                  <Label htmlFor={`voice-${option.id}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Funnel Stage (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {funnelStageOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`funnel-${option.id}`}
                    checked={formData.funnelStage.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("funnelStage", option.id, checked === true)
                    }
                  />
                  <Label htmlFor={`funnel-${option.id}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content Formats (select all that apply)</Label>
            <div className="grid grid-cols-2 gap-2">
              {contentFormatOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`format-${option.id}`}
                    checked={formData.contentFormats.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("contentFormats", option.id, checked === true)
                    }
                  />
                  <Label htmlFor={`format-${option.id}`} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="existingContent">Existing Content (optional)</Label>
            <Textarea
              id="existingContent"
              placeholder="List any existing content you have that could be repurposed for lead magnets"
              value={formData.existingContent}
              onChange={(e) => setFormData({ ...formData, existingContent: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Button
        type="submit"
        className="w-full"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Lead Magnets...
          </>
        ) : (
          "Generate Lead Magnets"
        )}
      </Button>
    </form>
  );
};

export default LeadMagnetForm;
