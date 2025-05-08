
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
    rawText?: string;
    extractedItems?: any;
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
  
  // Format level label from the data
  const formatLevelLabel = (level: string | undefined): string => {
    if (!level) return 'Not specified';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };
  
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
        
        {parsingResults?.extractedItems && (
          <details className="mt-3 pt-3 border-t">
            <summary className="cursor-pointer text-sm font-medium hover:text-primary">
              Show extracted items
            </summary>
            <div className="mt-2 space-y-3">
              {parsingResults.extractedItems.jobs && parsingResults.extractedItems.jobs.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold">Jobs</h4>
                  <ul className="text-xs space-y-1">
                    {parsingResults.extractedItems.jobs.map((job: any, index: number) => (
                      <li key={index} className="p-1 border border-muted rounded">
                        <div className="flex justify-between">
                          <span>{job.content}</span>
                          <span className="text-muted-foreground">
                            Priority: {formatLevelLabel(job.priority)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {parsingResults.extractedItems.pains && parsingResults.extractedItems.pains.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold">Pains</h4>
                  <ul className="text-xs space-y-1">
                    {parsingResults.extractedItems.pains.map((pain: any, index: number) => (
                      <li key={index} className="p-1 border border-muted rounded">
                        <div className="flex justify-between">
                          <span>{pain.content}</span>
                          <span className="text-muted-foreground">
                            Severity: {formatLevelLabel(pain.severity)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {parsingResults.extractedItems.gains && parsingResults.extractedItems.gains.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold">Gains</h4>
                  <ul className="text-xs space-y-1">
                    {parsingResults.extractedItems.gains.map((gain: any, index: number) => (
                      <li key={index} className="p-1 border border-muted rounded">
                        <div className="flex justify-between">
                          <span>{gain.content}</span>
                          <span className="text-muted-foreground">
                            Importance: {formatLevelLabel(gain.importance)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        )}
        
        {parsingResults?.rawText && (
          <details className="mt-3 pt-3 border-t">
            <summary className="cursor-pointer text-sm font-medium hover:text-primary">
              Show raw AI response
            </summary>
            <div className="mt-2 p-2 bg-muted/40 rounded max-h-[300px] overflow-auto">
              <pre className="text-xs whitespace-pre-wrap">{parsingResults.rawText}</pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default AIResponseValidator;
