
import { ReactNode } from 'react';

export interface FormFieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}
