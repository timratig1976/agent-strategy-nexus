
import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ValidatorProps {
  validationResults: {
    jobsComplete?: boolean;
    painsComplete?: boolean;
    gainsComplete?: boolean;
    isComplete?: boolean;
  };
  parsingResults?: {
    jobsFound?: number;
    painsFound?: number;
    gainsFound?: number;
  };
}

const AIResponseValidator: React.FC<ValidatorProps> = ({ validationResults, parsingResults }) => {
  if (!validationResults) return null;
  
  // Default values if not provided
  const jobs = validationResults.jobsComplete ?? false;
  const pains = validationResults.painsComplete ?? false;
  const gains = validationResults.gainsComplete ?? false;
  
  // Status icons
  const SuccessIcon = () => <CheckCircle2 className="h-4 w-4 text-green-600" />;
  const ErrorIcon = () => <XCircle className="h-4 w-4 text-red-600" />;
  const WarningIcon = () => <AlertCircle className="h-4 w-4 text-amber-500" />;
  
  return (
    <div className="bg-muted/20 p-4 rounded-lg border">
      <h3 className="font-medium mb-3">Response Data Validation</h3>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {jobs ? <SuccessIcon /> : <ErrorIcon />}
            <span>Customer Jobs</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {parsingResults?.jobsFound !== undefined && (
              <span>{parsingResults.jobsFound} items extracted</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {pains ? <SuccessIcon /> : <ErrorIcon />}
            <span>Customer Pains</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {parsingResults?.painsFound !== undefined && (
              <span>{parsingResults.painsFound} items extracted</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {gains ? <SuccessIcon /> : <ErrorIcon />}
            <span>Customer Gains</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {parsingResults?.gainsFound !== undefined && (
              <span>{parsingResults.gainsFound} items extracted</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4 pt-3 border-t">
          {validationResults.isComplete ? (
            <>
              <SuccessIcon />
              <span className="font-medium text-green-700">All sections successfully extracted</span>
            </>
          ) : (
            <>
              <WarningIcon />
              <span className="font-medium text-amber-700">Incomplete data extraction</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIResponseValidator;
