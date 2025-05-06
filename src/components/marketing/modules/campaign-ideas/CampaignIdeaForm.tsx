
import React from "react";
import { CampaignFormData } from "./types";
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
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

interface CampaignIdeaFormProps {
  formData: CampaignFormData;
  setFormData: React.Dispatch<React.SetStateAction<CampaignFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

const MARKETING_CHANNELS = [
  { label: "Social Media", value: "Social Media" },
  { label: "Email", value: "Email" },
  { label: "Content Marketing", value: "Content Marketing" },
  { label: "SEO", value: "SEO" },
  { label: "PPC Advertising", value: "PPC" },
  { label: "Events", value: "Events" },
  { label: "PR", value: "PR" },
  { label: "Influencer Marketing", value: "Influencer Marketing" },
  { label: "Video Marketing", value: "Video Marketing" },
  { label: "Affiliate Marketing", value: "Affiliate Marketing" }
];

const CampaignIdeaForm = ({
  formData,
  setFormData,
  onGenerate,
  isGenerating,
  error
}: CampaignIdeaFormProps) => {
  const handleChannelChange = (value: string, checked: CheckedState) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        channels: [...prev.channels, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        channels: prev.channels.filter(channel => channel !== value)
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
              <Label htmlFor="industry">Industry / Business Type *</Label>
              <Input
                id="industry"
                placeholder="e.g., E-commerce, SaaS, Healthcare"
                value={formData.industry}
                onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objective">Campaign Objective *</Label>
              <Select 
                value={formData.objective} 
                onValueChange={value => setFormData(prev => ({ ...prev, objective: value }))}
              >
                <SelectTrigger id="objective">
                  <SelectValue placeholder="Select an objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead generation">Lead Generation</SelectItem>
                  <SelectItem value="Brand awareness">Brand Awareness</SelectItem>
                  <SelectItem value="Sales/Conversions">Sales/Conversions</SelectItem>
                  <SelectItem value="Customer retention">Customer Retention</SelectItem>
                  <SelectItem value="Product launch">Product Launch</SelectItem>
                  <SelectItem value="Community engagement">Community Engagement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audience">Target Audience</Label>
            <Input
              id="audience"
              placeholder="e.g., Millennials interested in fitness, small business owners"
              value={formData.audience}
              onChange={e => setFormData(prev => ({ ...prev, audience: e.target.value }))}
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-options">
              <AccordionTrigger className="text-sm font-medium">
                Advanced Options
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select 
                      value={formData.budget} 
                      onValueChange={value => setFormData(prev => ({ ...prev, budget: value }))}
                    >
                      <SelectTrigger id="budget">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Below 5000">Below $5,000</SelectItem>
                        <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                        <SelectItem value="Above 50000">Above $50,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeframe">Campaign Timeframe</Label>
                    <Select 
                      value={formData.timeframe} 
                      onValueChange={value => setFormData(prev => ({ ...prev, timeframe: value }))}
                    >
                      <SelectTrigger id="timeframe">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than 1 month">Less than 1 month</SelectItem>
                        <SelectItem value="1-3 months">1-3 months</SelectItem>
                        <SelectItem value="3-6 months">3-6 months</SelectItem>
                        <SelectItem value="6-12 months">6-12 months</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="mb-2 block">Preferred Marketing Channels</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {MARKETING_CHANNELS.map((channel) => (
                        <div key={channel.value} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`channel-${channel.value}`} 
                            checked={formData.channels.includes(channel.value)}
                            onCheckedChange={(checked) => 
                              handleChannelChange(channel.value, checked)
                            }
                          />
                          <label 
                            htmlFor={`channel-${channel.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {channel.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Campaign Tone</Label>
                  <Select 
                    value={formData.tone} 
                    onValueChange={value => setFormData(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Humorous">Humorous</SelectItem>
                      <SelectItem value="Inspirational">Inspirational</SelectItem>
                      <SelectItem value="Educational">Educational</SelectItem>
                      <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any specific requirements, past campaign results, or other details that could help generate better ideas..."
                    value={formData.additionalInfo}
                    onChange={e => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                    rows={4}
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
              Generating Ideas...
            </>
          ) : (
            "Generate Campaign Ideas"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CampaignIdeaForm;
