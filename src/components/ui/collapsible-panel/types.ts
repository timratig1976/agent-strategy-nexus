
import { ReactNode } from 'react';

export interface CollapsiblePanelProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  icon?: ReactNode;
  headerExtra?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}
