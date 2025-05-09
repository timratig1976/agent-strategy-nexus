
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, LoaderIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { OutputLanguage } from "@/services/ai/types";

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
  outputLanguage?: OutputLanguage;
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
  outputLanguage = 'english'
}) => {
  // Determine if we should use German labels
  const isGerman = outputLanguage === 'deutsch';

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="industry">{isGerman ? 'Branche' : 'Industry'} *</Label>
            <Input 
              id="industry"
              placeholder={isGerman ? "z.B. Technologie, Gesundheitswesen, E-Commerce" : "e.g., Technology, Healthcare, E-commerce"}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="productDescription">{isGerman ? 'Produkt- oder Dienstleistungsbeschreibung' : 'Product or Service Description'} *</Label>
            <Textarea 
              id="productDescription"
              placeholder={isGerman ? "Beschreiben Sie Ihr Produkt oder Ihre Dienstleistung im Detail..." : "Describe your product or service in detail..."}
              rows={4}
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetMarket">{isGerman ? 'Zielmarkt' : 'Target Market'} *</Label>
            <Textarea 
              id="targetMarket"
              placeholder={isGerman ? 
                "Beschreiben Sie Ihren idealen Kunden oder Markt..." : 
                "Describe your ideal customer or market..."}
              rows={3}
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Label>{isGerman ? 'Personas werden generiert...' : 'Generating personas...'}</Label>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{Math.round(progress)}%</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="ml-auto flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <LoaderIcon size={16} className="animate-spin" />
                {isGerman ? 'Generiere Personas...' : 'Generating Personas...'}
              </>
            ) : (
              isGerman ? 'Personas generieren' : 'Generate Personas'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PersonaForm;
