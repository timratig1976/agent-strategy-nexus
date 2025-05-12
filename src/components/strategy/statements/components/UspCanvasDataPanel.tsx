
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UspCanvasDataPanelProps {
  uspCanvasData: any;
  isLoading: boolean;
}

const UspCanvasDataPanel: React.FC<UspCanvasDataPanelProps> = ({ uspCanvasData, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>USP Canvas Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!uspCanvasData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>USP Canvas Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No USP Canvas data available. Complete the USP Canvas first.</p>
        </CardContent>
      </Card>
    );
  }

  // Extract customer pain points and gains
  const customerPains = uspCanvasData.customerPains || [];
  const customerGains = uspCanvasData.customerGains || [];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">USP Canvas Reference Data</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="pains" className="w-full">
          <TabsList className="grid grid-cols-2 mx-4">
            <TabsTrigger value="pains">
              Pains 
              <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                {customerPains.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="gains">
              Gains
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                {customerGains.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pains" className="p-4">
            <ScrollArea className="h-[300px] pr-4">
              <ul className="space-y-2">
                {customerPains.map((pain: any) => (
                  <li key={pain.id} className="border rounded-md p-2 text-sm bg-red-50">
                    <div className="flex justify-between">
                      <span>{pain.content}</span>
                      <Badge variant="outline" className={`text-xs ${
                        pain.severity === "high" ? "bg-red-100 text-red-800" : 
                        pain.severity === "medium" ? "bg-amber-100 text-amber-800" : 
                        "bg-yellow-50 text-yellow-800"
                      }`}>
                        {pain.severity}
                      </Badge>
                    </div>
                  </li>
                ))}
                {customerPains.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No pain points defined</p>
                )}
              </ul>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="gains" className="p-4">
            <ScrollArea className="h-[300px] pr-4">
              <ul className="space-y-2">
                {customerGains.map((gain: any) => (
                  <li key={gain.id} className="border rounded-md p-2 text-sm bg-green-50">
                    <div className="flex justify-between">
                      <span>{gain.content}</span>
                      <Badge variant="outline" className={`text-xs ${
                        gain.importance === "high" ? "bg-green-100 text-green-800" : 
                        gain.importance === "medium" ? "bg-emerald-100 text-emerald-800" : 
                        "bg-teal-50 text-teal-800"
                      }`}>
                        {gain.importance}
                      </Badge>
                    </div>
                  </li>
                ))}
                {customerGains.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No gains defined</p>
                )}
              </ul>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UspCanvasDataPanel;
