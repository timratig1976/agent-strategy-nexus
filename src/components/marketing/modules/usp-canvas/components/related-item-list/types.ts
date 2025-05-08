
export interface RelatedItem {
  id: string;
  content: string;
  relatedItemIds: string[];
}

export interface RelatedCustomerItem {
  id: string;
  content: string;
  priority?: 'low' | 'medium' | 'high';
  severity?: 'low' | 'medium' | 'high';
  importance?: 'low' | 'medium' | 'high';
  isAIGenerated?: boolean;
}
