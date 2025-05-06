
import React from "react";
import { PersonaAttributes } from "./types";

interface PersonaDemographicsProps {
  attributes: PersonaAttributes;
}

export const PersonaDemographics: React.FC<PersonaDemographicsProps> = ({ attributes }) => {
  const demographicItems = [
    { label: "Age", value: attributes.age },
    { label: "Gender", value: attributes.gender },
    { label: "Income", value: attributes.income },
    { label: "Education", value: attributes.education },
    { label: "Occupation", value: attributes.occupation },
    { label: "Location", value: attributes.location }
  ];

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Demographics</h4>
      <div className="space-y-1 text-sm">
        {demographicItems.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-muted-foreground">{item.label}:</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
