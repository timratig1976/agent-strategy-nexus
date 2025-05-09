
import React from 'react';
import { StatusIndicatorProps } from './types';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  InfoIcon, 
  Clock 
} from 'lucide-react';

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  text,
  icon,
  className = '',
  size = 'md'
}) => {
  // Define color classes based on status
  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Define default icon based on status
  const getStatusIcon = () => {
    if (icon) return icon;

    const iconProps = { 
      className: 'shrink-0', 
      size: size === 'sm' ? 14 : size === 'md' ? 16 : 18 
    };

    switch (status) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      case 'error':
        return <AlertCircle {...iconProps} />;
      case 'info':
        return <InfoIcon {...iconProps} />;
      case 'pending':
        return <Clock {...iconProps} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  // Define size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <div className={`
      inline-flex items-center rounded-full border
      ${getStatusClasses()}
      ${sizeClasses[size]}
      ${className}
    `}>
      {getStatusIcon()}
      {text && <span className="ml-1.5">{text}</span>}
    </div>
  );
};

export default StatusIndicator;
