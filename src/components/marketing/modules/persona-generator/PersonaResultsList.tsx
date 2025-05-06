
import React from "react";
import { Button } from "@/components/ui/button";
import PersonaCard from "./PersonaCard";
import { Persona } from "./types";

interface PersonaResultsListProps {
  personas: Persona[];
  handleReset: () => void;
}

const PersonaResultsList: React.FC<PersonaResultsListProps> = ({ personas, handleReset }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generated Personas</h3>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Create New Personas
        </Button>
      </div>
      
      {personas.map((persona, index) => (
        <PersonaCard key={index} persona={persona} />
      ))}
    </div>
  );
};

export default PersonaResultsList;
