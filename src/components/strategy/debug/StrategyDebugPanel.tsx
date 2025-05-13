
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, Download, Copy, Bug } from "lucide-react";
import { toast } from "sonner";

interface StrategyDebugPanelProps {
  debugInfo: any;
  title?: string;
  className?: string;
}

/**
 * A standardized debug panel component for displaying AI debug information
 * across all strategy flow pages
 */
const StrategyDebugPanel: React.FC<StrategyDebugPanelProps> = ({
  debugInfo,
  title = "AI Debug Information",
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("request");

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

  // Extract specific parts of debug info
  const requestData = debugInfo?.requestData || debugInfo;
  const responseData = debugInfo?.responseData || {};
  const promptsData = debugInfo?.promptsData || debugInfo?.prompts || {};

  // Download debug data as JSON file
  const downloadDebugData = () => {
    try {
      const jsonString = safeStringify(debugInfo);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = href;
      link.download = `debug-data-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
      toast.success("Debug data downloaded");
    } catch (error) {
      console.error("Failed to download debug data:", error);
      toast.error("Failed to download debug data");
    }
  };

  // Copy debug data to clipboard
  const copyDebugData = () => {
    try {
      const jsonString = safeStringify(debugInfo);
      navigator.clipboard.writeText(jsonString);
      toast.success("Debug data copied to clipboard");
    } catch (error) {
      console.error("Failed to copy debug data:", error);
      toast.error("Failed to copy debug data");
    }
  };

  if (!debugInfo) return null;

  return (
    <Card className={`mt-6 ${className}`}>
      <CardHeader className="py-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bug className="h-4 w-4" />
          {title}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyDebugData}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadDebugData}
            title="Download debug data"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <Tabs 
            defaultValue="request" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="mt-2">
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-xs whitespace-pre-wrap">
                  {safeStringify(requestData)}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="response" className="mt-2">
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-xs whitespace-pre-wrap">
                  {safeStringify(responseData)}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="prompts" className="mt-2">
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-xs whitespace-pre-wrap">
                  {safeStringify(promptsData)}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="raw" className="mt-2">
              <div className="bg-gray-50 p-4 rounded-md overflow-auto max-h-96">
                <pre className="text-xs whitespace-pre-wrap">
                  {safeStringify(debugInfo)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
};

export default StrategyDebugPanel;
