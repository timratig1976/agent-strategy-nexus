
import React from "react";

interface PersonaBehaviorsProps {
  behaviors: string[];
}

export const PersonaBehaviors: React.FC<PersonaBehaviorsProps> = ({ behaviors }) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-1">Behaviors</h4>
      <ul className="list-disc list-inside text-sm space-y-1">
        {behaviors.map((behavior, idx) => (
          <li key={idx}>{behavior}</li>
        ))}
      </ul>
    </div>
  );
};
