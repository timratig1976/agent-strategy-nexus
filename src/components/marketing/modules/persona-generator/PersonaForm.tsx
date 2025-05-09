
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { LoaderCircle } from "lucide-react";

interface PersonaFormProps {
  industry: string;
  setIndustry: (value: string) => void;
  productDescription: string;
  setProductDescription: (value: string) => void;
  targetMarket: string;
  setTargetMarket: (value: string) => void;
  isLoading: boolean;
  progress: number;
  error: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}

const PersonaForm: React.FC<PersonaFormProps> = ({
  industry,
  setIndustry,
  productDescription,
  setProductDescription,
  targetMarket,
  setTargetMarket,
  isLoading,
  progress,
  error,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry or Business Type*</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., E-commerce, SaaS, Financial Services..."
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productDescription">Product or Service Description*</Label>
            <Textarea
              id="productDescription"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Describe what you offer, including key features and benefits..."
              rows={3}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetMarket">Target Market*</Label>
            <Textarea
              id="targetMarket"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              placeholder="Describe who you're targeting (age, location, interests, needs)..."
              rows={3}
              required
              disabled={isLoading}
            />
          </div>
          
          {isLoading && (
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Generating personas...</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t p-6 flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Personas"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PersonaForm;
