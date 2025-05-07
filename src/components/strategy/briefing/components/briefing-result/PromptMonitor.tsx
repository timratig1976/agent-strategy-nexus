
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PromptMonitorProps {
  debugInfo: any;
}

const PromptMonitor: React.FC<PromptMonitorProps> = ({ debugInfo }) => {
  return (
    <Card className="bg-muted/30">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">AI Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xs">Request Data</AccordionTrigger>
            <AccordionContent>
              <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded">
                {JSON.stringify(debugInfo?.requestData || debugInfo, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xs">Response Data</AccordionTrigger>
            <AccordionContent>
              <pre className="text-xs whitespace-pre-wrap bg-muted p-2 rounded">
                {JSON.stringify(debugInfo?.responseData || {}, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PromptMonitor;
