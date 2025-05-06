
import React from "react";
import { AdCreative } from "./types";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, Save, MessageSquare, Image } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AdCreativeResultsProps {
  adCreatives: AdCreative[];
  onSave: (creative: AdCreative) => void;
  onBack: () => void;
}

const AdCreativeResults = ({
  adCreatives,
  onSave,
  onBack
}: AdCreativeResultsProps) => {
  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Generator
      </Button>

      <h3 className="text-xl font-semibold mb-4">Generated Ad Creatives</h3>
      
      {adCreatives.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No ad creatives generated yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {adCreatives.map((creative) => (
            <Card key={creative.id} className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="mb-2">{creative.platform}</Badge>
                    <CardTitle className="text-xl">{creative.headline}</CardTitle>
                  </div>
                  <Badge variant="outline">{creative.format}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-0">
                <Tabs defaultValue="text">
                  <TabsList className="mb-4">
                    <TabsTrigger value="text" className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="visual" className="flex items-center gap-1">
                      <Image className="h-3.5 w-3.5" />
                      Visual Concept
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
                      <p>{creative.description}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Call to Action</p>
                      <Badge variant="secondary" className="text-base rounded-md px-4 py-1.5">
                        {creative.callToAction}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Target Audience</p>
                      <p className="text-sm">{creative.targetAudience}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="visual">
                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-center mb-4">
                        <Image className="h-12 w-12 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-center mb-2">Visual Concept</h4>
                      <p className="text-center text-muted-foreground">
                        {creative.visualDescription}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              
              <CardFooter className="border-t pt-4 mt-4">
                <Button 
                  variant="outline" 
                  className="ml-auto flex items-center gap-2"
                  onClick={() => onSave(creative)}
                >
                  <Save className="h-4 w-4" />
                  Save Creative
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdCreativeResults;
