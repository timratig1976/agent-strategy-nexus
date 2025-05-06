
import React from "react";
import { ContentPillar } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ContentPillarCard from "./components/ContentPillarCard";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";

interface ContentStrategyResultsProps {
  contentPillars: ContentPillar[];
  onSave: (pillar: ContentPillar) => void;
  isGenerating: boolean;
}

const ContentStrategyResults = ({
  contentPillars,
  onSave,
  isGenerating
}: ContentStrategyResultsProps) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Generated Content Pillars</h3>
      </div>
      
      {isGenerating ? (
        <LoadingState />
      ) : contentPillars.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {contentPillars.map((pillar) => (
            <ContentPillarCard 
              key={pillar.id} 
              pillar={pillar} 
              onSave={onSave} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentStrategyResults;
