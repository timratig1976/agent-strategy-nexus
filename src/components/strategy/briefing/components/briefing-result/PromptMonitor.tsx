
import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, AlertTriangle, MonitorPlay } from 'lucide-react';

interface PromptMonitorProps {
  debugInfo?: {
    requestData?: any;
    responseData?: any;
  };
  isError?: boolean;
}

const PromptMonitor: React.FC<PromptMonitorProps> = ({ debugInfo, isError = false }) => {
  if (!debugInfo) {
    return null;
  }

  const { requestData, responseData } = debugInfo;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-1 ${isError ? 'bg-red-50 text-red-800 hover:bg-red-100' : ''}`}
        >
          {isError ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <MonitorPlay className="h-4 w-4" />
          )}
          <span>AI Monitor</span>
          {!isError && <Check className="h-3 w-3 text-green-600 ml-1" />}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MonitorPlay className="h-5 w-5" />
            AI Communication Monitor
          </SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="request" className="mt-4">
          <TabsList>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
          <TabsContent value="request" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Request Data</h3>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                  {requestData && (
                    <>
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold">Module</h4>
                        <p className="text-sm bg-gray-50 p-2 rounded">{requestData.module}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold">Action</h4>
                        <p className="text-sm bg-gray-50 p-2 rounded">{requestData.action}</p>
                      </div>
                      {requestData.data && (
                        <div className="space-y-1">
                          <h4 className="text-xs font-semibold">Data Payload</h4>
                          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                            {JSON.stringify(requestData.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="response" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Response Data</h3>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                {responseData ? (
                  <pre className="text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No response data available
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default PromptMonitor;
