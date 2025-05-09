
import { ReactNode } from 'react';

export interface ComponentContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
  error?: string | null;
}
