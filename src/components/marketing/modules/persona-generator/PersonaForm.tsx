
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  handleSubmit
}) => {
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create Buyer Personas</CardTitle>
          <CardDescription>
            Provide information about your business to generate detailed buyer personas
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g., Software, Healthcare, Retail"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product-description">Product or Service Description</Label>
            <Textarea
              id="product-description"
              placeholder="Describe your product or service in detail"
              rows={4}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target-market">Target Market</Label>
            <Textarea
              id="target-market"
              placeholder="Describe who you think your ideal customers are"
              rows={3}
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="persona-count">Number of Personas</Label>
            <Select defaultValue="2" disabled={isLoading}>
              <SelectTrigger id="persona-count">
                <SelectValue placeholder="Select number of personas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Persona</SelectItem>
                <SelectItem value="2">2 Personas</SelectItem>
                <SelectItem value="3">3 Personas</SelectItem>
                <SelectItem value="4">4 Personas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Generating personas...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Personas"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PersonaForm;
