
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AIDebugPanelProps {
  debugInfo: any;
  title?: string;
}

const AIDebugPanel: React.FC<AIDebugPanelProps> = ({
  debugInfo,
  title = "AI Debug Information"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safely stringify JSON with circular references handling
  const safeStringify = (obj: any, indent = 2) => {
    try {
      // Handle circular references
      const seen = new WeakSet();
      return JSON.stringify(
        obj,
        (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return "[Circular Reference]";
            }
            seen.add(value);
          }
          return value;
        },
        indent
      );
    } catch (error) {
      return `[Error displaying object: ${error instanceof Error ? error.message : String(error)}]`;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="py-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
            <pre className="text-xs whitespace-pre-wrap">
              {safeStringify(debugInfo)}
            </pre>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AIDebugPanel;
