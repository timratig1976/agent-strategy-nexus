
export type CustomerItemType = 'job' | 'pain' | 'gain';
export type RatingType = 'priority' | 'severity' | 'importance';
export type RatingValue = 'low' | 'medium' | 'high';

export interface CustomerItemProps {
  id: string;
  content: string;
  rating: RatingValue;
  isAIGenerated?: boolean;
}
