
import React from 'react';
import { FormFieldProps } from './types';
import { Label } from '@/components/ui/label';

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  description,
  error,
  required = false,
  className = '',
  children
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label 
        htmlFor={id} 
        className={`block text-sm font-medium ${error ? 'text-destructive' : ''}`}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {children}
      
      {description && !error && (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
