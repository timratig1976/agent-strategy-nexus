
import React from "react";
import { ContentPillar } from "./types";
import { Button } from "@/components/ui/button";
import { FileText, Clock, ArrowLeft, Bookmark } from "lucide-react";
import { format } from "date-fns";
import ContentPillarCard from "./components/ContentPillarCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AIResultEditor } from "@/components/marketing/shared/AIResultEditor";

interface ContentStrategyResultsProps {
  contentPillars: ContentPillar[];
  onSave: (pillar: ContentPillar) => Promise<boolean> | boolean;
  onBack: () => void;
}

const ContentStrategyResults = ({ 
  contentPillars, 
  onSave, 
  onBack 
}: ContentStrategyResultsProps) => {
  const handleSavePillar = (updatedPillar: ContentPillar) => {
    return onSave(updatedPillar);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Generator
        </Button>
        
        <p className="text-sm text-muted-foreground">
          {contentPillars.length} content {contentPillars.length === 1 ? 'pillar' : 'pillars'} generated
        </p>
      </div>

      {contentPillars.length > 0 ? (
        <div className="space-y-10">
          {contentPillars.map((pillar) => (
            <div key={pillar.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Content Pillar: {pillar.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    Generated on {format(new Date(pillar.createdAt), "MMM d, yyyy")}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ContentPillarCard pillar={pillar} onSave={() => handleSavePillar(pillar)} />
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Edit AI-Generated Content</h3>
                    <AIResultEditor
                      title="Edit Content Pillar Description"
                      description="Refine the AI-generated description to better match your needs"
                      originalContent={pillar}
                      contentField="description"
                      onSave={handleSavePillar}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          
          <div className="flex justify-center">
            <Button 
              onClick={() => onSave(contentPillars[0])}
              className="flex items-center"
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Save This Content Strategy
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No content pillars have been generated yet.</p>
        </Card>
      )}
    </div>
  );
};

export default ContentStrategyResults;
