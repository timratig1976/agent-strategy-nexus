
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const MARKETING_GOALS = [
  "Brand Awareness", "Lead Generation", "Customer Retention", 
  "Thought Leadership", "SEO Rankings", "Social Engagement"
];

interface MarketingGoalsSelectorProps {
  selectedGoals: string[];
  onChange: (field: string, value: string, isChecked: boolean) => void;
}

const MarketingGoalsSelector = ({ selectedGoals, onChange }: MarketingGoalsSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Marketing Goals</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {MARKETING_GOALS.map((goal) => (
          <div key={goal} className="flex items-center space-x-2">
            <Checkbox 
              id={`goal-${goal}`}
              checked={selectedGoals.includes(goal)}
              onCheckedChange={(checked) => 
                onChange('marketingGoals', goal, checked === true)
              }
            />
            <Label htmlFor={`goal-${goal}`} className="text-sm font-normal cursor-pointer">
              {goal}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketingGoalsSelector;
