
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Loader2, AlertCircle, Info } from "lucide-react";

interface FunnelAIGeneratorProps {
  strategyId: string;
  onGenerateFunnel: () => void;
  isGenerating: boolean;
  progress: number;
  error: string | null;
}

const FunnelAIGenerator: React.FC<FunnelAIGeneratorProps> = ({
  strategyId,
  onGenerateFunnel,
  isGenerating,
  progress,
  error
}) => {
  const [enhancementText, setEnhancementText] = useState<string>("");
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  const handleGenerate = () => {
    onGenerateFunnel();
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Funnel Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Generate a marketing funnel strategy based on your USP Canvas and target persona data. The AI will analyze your unique selling proposition, customer pain points, and audience insights to create an optimized conversion funnel.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enhancement-text">Additional Instructions (Optional)</Label>
              <Textarea
                id="enhancement-text"
                placeholder="Add any specific requirements for your funnel strategy (e.g., specific channels, conversion goals, or unique requirements)"
                value={enhancementText}
                onChange={(e) => setEnhancementText(e.target.value)}
                rows={3}
                disabled={isGenerating}
              />
            </div>
            
            <div className="flex justify-end">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Funnel Strategy
                  </>
                )}
              </Button>
            </div>
            
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Generating your funnel strategy</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Generation Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Generation Details</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </CardTitle>
        </CardHeader>
        {showDetails && (
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>How the AI Funnel Generator Works</AlertTitle>
              <AlertDescription>
                <p className="mt-2">
                  The AI analyzes data from your strategy to generate an optimized marketing funnel:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>USP Canvas data (jobs, pains, gains) to identify key value propositions</li>
                  <li>Persona information to align the funnel with target audience behaviors</li>
                  <li>Industry patterns and best practices for effective funnel architecture</li>
                  <li>Marketing touchpoints optimized for each stage of the customer journey</li>
                  <li>Conversion optimization tactics for maximum effectiveness</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <div>
              <h4 className="font-medium mb-2">Funnel Optimization Tips</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>1. Stage alignment:</strong> Ensure each funnel stage aligns with specific customer needs and questions
                </p>
                <p className="text-sm">
                  <strong>2. Clear progression:</strong> Design smooth transitions between stages with appropriate CTAs
                </p>
                <p className="text-sm">
                  <strong>3. Measurement:</strong> Define clear metrics for each funnel stage to track performance
                </p>
                <p className="text-sm">
                  <strong>4. Conversion focus:</strong> Minimize friction and create compelling offers at critical conversion points
                </p>
                <p className="text-sm">
                  <strong>5. Testing plan:</strong> Implement A/B testing for key funnel elements to optimize over time
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FunnelAIGenerator;
