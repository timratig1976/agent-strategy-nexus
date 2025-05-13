
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AIDebugMonitorProps } from "./types";

/**
 * Component for displaying debug information about AI prompts and responses
 */
const AIDebugMonitor: React.FC<AIDebugMonitorProps> = ({
  debugInfo,
  title = "AI Debug Information"
}) => {
  if (!debugInfo) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">No debug information available</p>
      </div>
    );
  }

  const renderValue = (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return <pre className="text-xs overflow-auto p-2 bg-muted rounded">{JSON.stringify(value, null, 2)}</pre>;
    }
    return <span>{String(value)}</span>;
  };

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-medium">{title}</h3>
      
      {/* System Prompt */}
      {debugInfo.systemPrompt && (
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            System Prompt <Badge variant="outline">AI Instructions</Badge>
          </h4>
          <div className="bg-muted p-3 rounded text-sm overflow-auto max-h-40">
            <pre className="whitespace-pre-wrap">{debugInfo.systemPrompt}</pre>
          </div>
        </div>
      )}
      
      {/* User Prompt */}
      {debugInfo.userPrompt && (
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            User Prompt <Badge variant="outline">Query</Badge>
          </h4>
          <div className="bg-muted p-3 rounded text-sm overflow-auto max-h-40">
            <pre className="whitespace-pre-wrap">{debugInfo.userPrompt}</pre>
          </div>
        </div>
      )}
      
      {/* Model Used */}
      {debugInfo.model && (
        <div>
          <h4 className="font-medium mb-1">Model</h4>
          <p className="text-sm">{debugInfo.model}</p>
        </div>
      )}
      
      {/* Processing Time */}
      {debugInfo.processingTime && (
        <div>
          <h4 className="font-medium mb-1">Processing Time</h4>
          <p className="text-sm">{debugInfo.processingTime}ms</p>
        </div>
      )}
      
      {/* Additional Debug Info */}
      {Object.entries(debugInfo)
        .filter(([key]) => !['systemPrompt', 'userPrompt', 'model', 'processingTime'].includes(key))
        .map(([key, value]) => (
          <div key={key}>
            <h4 className="font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
            <div className="text-sm">{renderValue(value)}</div>
          </div>
        ))}
    </div>
  );
};

export default AIDebugMonitor;
