
import { ReactNode } from 'react';

export interface ContentCardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  isActive?: boolean;
  onClick?: () => void;
}
