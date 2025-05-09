
import React from 'react';
import { ContentCardProps } from './types';

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  icon,
  children,
  footer,
  className = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  isActive = false,
  onClick
}) => {
  // Apply classes conditionally
  const cardClasses = `
    border rounded-lg bg-card ${isActive ? 'border-primary ring-1 ring-primary/10' : 'border-border'}
    ${onClick ? 'cursor-pointer hover:border-primary/50 transition-all' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses.trim()} onClick={onClick}>
      {(title || icon) && (
        <div className={`flex items-center p-4 border-b ${headerClassName}`}>
          {icon && <div className="mr-3">{icon}</div>}
          {title && <h3 className="font-medium">{title}</h3>}
        </div>
      )}
      
      <div className={`p-4 ${contentClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-4 py-3 border-t flex items-center justify-end ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default ContentCard;
