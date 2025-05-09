
import { ReactNode } from 'react';

export interface DataListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string;
  header?: ReactNode;
  footer?: ReactNode;
  emptyState?: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}
