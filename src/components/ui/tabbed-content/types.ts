
import { ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: string | ReactNode;
  content: ReactNode;
  count?: number; 
  tooltip?: string;
  disabled?: boolean;
}

export interface TabbedContentProps {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'outline' | 'underline';
}
