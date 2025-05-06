
import React from "react";

interface PersonaMediaPreferencesProps {
  mediaPreferences: string[];
}

export const PersonaMediaPreferences: React.FC<PersonaMediaPreferencesProps> = ({ mediaPreferences }) => {
  return (
    <div>
      <h4 className="text-sm font-medium mb-1">Media Preferences</h4>
      <div className="flex flex-wrap gap-2">
        {mediaPreferences.map((media, idx) => (
          <div key={idx} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
            {media}
          </div>
        ))}
      </div>
    </div>
  );
};
