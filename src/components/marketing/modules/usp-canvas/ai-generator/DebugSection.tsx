
import React from 'react';
import AIDebugPanel from '@/components/shared/AIDebugPanel';

interface DebugSectionProps {
  debugInfo: any;
  showDebug: boolean;
}

const DebugSection: React.FC<DebugSectionProps> = ({
  debugInfo,
  showDebug
}) => {
  if (!showDebug || !debugInfo) return null;
  
  return (
    <AIDebugPanel 
      debugInfo={debugInfo} 
      title="USP Canvas AI Generator Debug Information"
    />
  );
};

export default DebugSection;
