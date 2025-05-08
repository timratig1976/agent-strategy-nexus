
export type CustomerItemType = 'job' | 'pain' | 'gain';
export type RatingType = 'priority' | 'severity' | 'importance';
export type RatingValue = 'low' | 'medium' | 'high';

export interface CustomerItemProps {
  id: string;
  content: string;
  rating: RatingValue;
  isAIGenerated?: boolean;
}

export interface CustomerItemListProps {
  title: string;
  tooltipTitle: string;
  tooltipContent: string;
  itemType: CustomerItemType;
  ratingType: RatingType;
  items: CustomerItemProps[];
  placeholderText: string;
  emptyStateType: string;
  onAdd: (content: string, rating: RatingValue, isAIGenerated?: boolean) => void;
  onUpdate: (id: string, content: string, rating: RatingValue) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedItems: CustomerItemProps[]) => void;
  formPosition?: 'top' | 'bottom';
}
