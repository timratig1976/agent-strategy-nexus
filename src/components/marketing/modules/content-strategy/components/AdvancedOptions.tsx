
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import MarketingGoalsSelector from "./MarketingGoalsSelector";
import ContentFormatsSelector from "./ContentFormatsSelector";
import DistributionChannelsSelector from "./DistributionChannelsSelector";

interface AdvancedOptionsProps {
  formData: {
    marketingGoals: string[];
    existingContent: string;
    competitorInsights: string;
    contentFormats: string[];
    distributionChannels: string[];
  };
  setFormData: (data: any) => void;
  handleCheckboxChange: (field: string, value: string, isChecked: boolean) => void;
}

const AdvancedOptions = ({ 
  formData, 
  setFormData, 
  handleCheckboxChange 
}: AdvancedOptionsProps) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="advanced-options">
        <AccordionTrigger className="text-sm font-medium">
          Advanced Options
        </AccordionTrigger>
        <AccordionContent className="space-y-6 pt-4">
          <MarketingGoalsSelector 
            selectedGoals={formData.marketingGoals}
            onChange={handleCheckboxChange}
          />

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

          <ContentFormatsSelector
            selectedFormats={formData.contentFormats}
            onChange={handleCheckboxChange}
          />

          <DistributionChannelsSelector
            selectedChannels={formData.distributionChannels}
            onChange={handleCheckboxChange}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedOptions;
