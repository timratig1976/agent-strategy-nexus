
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PersonaDemographics } from "./PersonaDemographics";
import { PersonaGoalsPainPoints } from "./PersonaGoalsPainPoints";
import { PersonaBehaviors } from "./PersonaBehaviors";
import { PersonaMediaPreferences } from "./PersonaMediaPreferences";
import { Persona } from "./types";

interface PersonaCardProps {
  persona: Persona;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => {
  const { toast } = useToast();

  const handleDownload = (persona: Persona) => {
    // In a real implementation, this would generate a PDF or other downloadable format
    toast({
      title: "Persona downloaded",
      description: `${persona.name} persona has been downloaded`,
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-4">
          {persona.photoUrl && (
            <div className="h-16 w-16 rounded-full overflow-hidden">
              <img 
                src={persona.photoUrl} 
                alt={persona.name} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div>
            <CardTitle>{persona.name}</CardTitle>
            <CardDescription className="mt-1">{persona.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PersonaDemographics attributes={persona.attributes} />
          <PersonaGoalsPainPoints 
            goals={persona.attributes.goals}
            painPoints={persona.attributes.painPoints}
          />
        </div>
        
        <div className="mt-4 space-y-3">
          <PersonaBehaviors behaviors={persona.attributes.behaviors} />
          <PersonaMediaPreferences mediaPreferences={persona.attributes.mediaPreferences} />
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleDownload(persona)}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Persona
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonaCard;
