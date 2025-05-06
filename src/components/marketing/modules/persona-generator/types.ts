
export interface PersonaAttributes {
  age: string;
  gender: string;
  income: string;
  education: string;
  occupation: string;
  location: string;
  challenges: string[];
  goals: string[];
  painPoints: string[];
  behaviors: string[];
  mediaPreferences: string[];
}

export interface Persona {
  name: string;
  description: string;
  photoUrl?: string;
  attributes: PersonaAttributes;
}
