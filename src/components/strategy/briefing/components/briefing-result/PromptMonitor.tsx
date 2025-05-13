
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PromptMonitorProps {
  debugInfo: any;
}

const PromptMonitor: React.FC<PromptMonitorProps> = ({ debugInfo }) => {
  return (
    <div className="py-2">
      <h2 className="text-lg font-semibold mb-4">AI Debug Information</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm font-medium">Request Data</AccordionTrigger>
          <AccordionContent>
            <div className="bg-muted/30 p-3 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(debugInfo?.requestData || debugInfo, null, 2)}
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-sm font-medium">Response Data</AccordionTrigger>
          <AccordionContent>
            <div className="bg-muted/30 p-3 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(debugInfo?.responseData || {}, null, 2)}
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-sm font-medium">Full Debug</AccordionTrigger>
          <AccordionContent>
            <div className="bg-muted/30 p-3 rounded-md overflow-auto max-h-[400px]">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PromptMonitor;
