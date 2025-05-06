
import React from "react";
import { UspFormData } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UspGeneratorFormProps {
  formData: UspFormData;
  setFormData: React.Dispatch<React.SetStateAction<UspFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

const UspGeneratorForm = ({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  error
}: UspGeneratorFormProps) => {
  // Available business values options
  const businessValueOptions = [
    "Quality", "Innovation", "Customer-focus", "Reliability", 
    "Affordability", "Transparency", "Sustainability", "Expertise",
    "Flexibility", "Efficiency", "Integrity", "Collaboration"
  ];

  // Available business strengths options
  const businessStrengthOptions = [
    "Technology", "Customer Service", "Experience", "Speed", 
    "Customization", "Pricing", "Quality Control", "Innovation",
    "Team Expertise", "Geographic Reach", "Supply Chain", "Product Range"
  ];

  // Helper function to handle business values change
  const handleValueToggle = (value: string) => {
    setFormData(prev => {
      const values = [...prev.businessValues];
      
      if (values.includes(value)) {
        return {
          ...prev,
          businessValues: values.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          businessValues: [...values, value]
        };
      }
    });
  };

  // Helper function to handle business strengths change
  const handleStrengthToggle = (strength: string) => {
    setFormData(prev => {
      const strengths = [...prev.businessStrengths];
      
      if (strengths.includes(strength)) {
        return {
          ...prev,
          businessStrengths: strengths.filter(s => s !== strength)
        };
      } else {
        return {
          ...prev,
          businessStrengths: [...strengths, strength]
        };
      }
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/15 border border-destructive/30 text-destructive rounded-md">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                placeholder="e.g., Acme Corporation"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              />
            </div>
            
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g., Software Development"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              />
            </div>
          </div>
          
          {/* Target Audience */}
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience *</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., Small business owners aged 30-50"
              value={formData.targetAudience}
              onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
            />
          </div>
          
          {/* Key Features */}
          <div className="space-y-2">
            <Label htmlFor="keyFeatures">Key Features or Benefits</Label>
            <Textarea
              id="keyFeatures"
              placeholder="e.g., AI-powered automation, 24/7 support, 50% faster processing"
              value={formData.keyFeatures}
              onChange={(e) => setFormData(prev => ({ ...prev, keyFeatures: e.target.value }))}
              rows={3}
            />
          </div>
          
          {/* Competitor Weaknesses */}
          <div className="space-y-2">
            <Label htmlFor="competitorWeaknesses">Competitor Weaknesses</Label>
            <Textarea
              id="competitorWeaknesses"
              placeholder="e.g., Limited customer support, outdated technology, high pricing"
              value={formData.competitorWeaknesses}
              onChange={(e) => setFormData(prev => ({ ...prev, competitorWeaknesses: e.target.value }))}
              rows={3}
            />
          </div>
          
          {/* Customer Pain Points */}
          <div className="space-y-2">
            <Label htmlFor="customerPainPoints">Customer Pain Points</Label>
            <Textarea
              id="customerPainPoints"
              placeholder="e.g., Time-consuming manual processes, lack of real-time insights"
              value={formData.customerPainPoints}
              onChange={(e) => setFormData(prev => ({ ...prev, customerPainPoints: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Business Values */}
          <div className="space-y-3">
            <Label>Business Values (Select up to 3)</Label>
            <div className="flex flex-wrap gap-2">
              {businessValueOptions.map(value => (
                <Badge
                  key={value}
                  variant={formData.businessValues.includes(value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleValueToggle(value)}
                >
                  {formData.businessValues.includes(value) && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  {value}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Business Strengths */}
          <div className="space-y-3">
            <Label>Business Strengths (Select up to 3)</Label>
            <div className="flex flex-wrap gap-2">
              {businessStrengthOptions.map(strength => (
                <Badge
                  key={strength}
                  variant={formData.businessStrengths.includes(strength) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleStrengthToggle(strength)}
                >
                  {formData.businessStrengths.includes(strength) && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  {strength}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button 
            type="button" 
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating USPs...
              </>
            ) : (
              "Generate Unique Selling Propositions"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UspGeneratorForm;
