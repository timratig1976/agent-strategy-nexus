
import React from "react";

interface PersonaGoalsPainPointsProps {
  goals: string[];
  painPoints: string[];
}

export const PersonaGoalsPainPoints: React.FC<PersonaGoalsPainPointsProps> = ({ goals, painPoints }) => {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium mb-1">Goals</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {goals.map((goal, idx) => (
            <li key={idx}>{goal}</li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-1">Pain Points</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {painPoints.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
