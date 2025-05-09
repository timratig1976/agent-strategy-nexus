
import { ReactNode } from 'react';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

export interface StatusIndicatorProps {
  status: StatusType;
  text?: string;
  icon?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
