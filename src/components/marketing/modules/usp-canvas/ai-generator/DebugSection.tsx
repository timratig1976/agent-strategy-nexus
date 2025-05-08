
import React from 'react';
import AIDebugPanel from '@/components/shared/AIDebugPanel';

interface DebugSectionProps {
  debugInfo: any;
  parseResults: any;
  validationResults?: {
    jobsComplete?: boolean;
    painsComplete?: boolean;
    gainsComplete?: boolean;
    isComplete?: boolean;
  };
  rawResponse?: any;
  generationHistory?: any[];
  showDebug: boolean;
}

const DebugSection: React.FC<DebugSectionProps> = ({
  debugInfo,
  parseResults,
  validationResults,
  rawResponse,
  generationHistory,
  showDebug
}) => {
  if (!showDebug || !debugInfo) return null;
  
  return (
    <>
      <AIDebugPanel 
        debugInfo={debugInfo} 
        title="USP Canvas AI Generator Debug Information"
      />
      
      {parseResults && !validationResults && (
        <div className="bg-muted/20 p-4 rounded-lg border mt-4">
          <h3 className="font-medium mb-2">Data Extraction Results</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Jobs found:</span>
                <span className={parseResults.jobsFound > 0 ? "text-green-600" : "text-red-600"}>
                  {parseResults.jobsFound}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Pains found:</span>
                <span className={parseResults.painsFound > 0 ? "text-green-600" : "text-red-600"}>
                  {parseResults.painsFound}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Gains found:</span>
                <span className={parseResults.gainsFound > 0 ? "text-green-600" : "text-red-600"}>
                  {parseResults.gainsFound}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {rawResponse && (
        <div className="bg-muted/20 p-4 rounded-lg border mt-4">
          <h3 className="font-medium mb-2">Raw AI Response</h3>
          <div className="bg-gray-900 text-gray-200 p-3 rounded overflow-auto max-h-64 text-xs">
            <pre>{JSON.stringify(rawResponse.data, null, 2)}</pre>
          </div>
        </div>
      )}
      
      {generationHistory && generationHistory.length > 0 && (
        <AIDebugPanel 
          debugInfo={generationHistory} 
          title="Generation History"
        />
      )}
    </>
  );
};

export default DebugSection;
