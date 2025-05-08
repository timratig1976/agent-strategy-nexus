
import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ProductServices from "./ProductServices";
import PainRelievers from "./PainRelievers";
import GainCreators from "./GainCreators";
import { UspCanvas, ProductService, PainReliever, GainCreator } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabsList from "./components/tabs/TabsList";
import { TabsTrigger } from "@/components/ui/tabs";

interface ValueMapCanvasProps {
  canvas: UspCanvas;
  addProductService: (content: string, relatedJobIds: string[]) => void;
  updateProductService: (id: string, content: string, relatedJobIds: string[]) => void;
  deleteProductService: (id: string) => void;
  addPainReliever: (content: string, relatedPainIds: string[]) => void;
  updatePainReliever: (id: string, content: string, relatedPainIds: string[]) => void;
  deletePainReliever: (id: string) => void;
  addGainCreator: (content: string, relatedGainIds: string[]) => void;
  updateGainCreator: (id: string, content: string, relatedGainIds: string[]) => void;
  deleteGainCreator: (id: string) => void;
  formPosition?: 'top' | 'bottom';
}

const ValueMapCanvas = ({
  canvas,
  addProductService,
  updateProductService,
  deleteProductService,
  addPainReliever,
  updatePainReliever,
  deletePainReliever,
  addGainCreator,
  updateGainCreator,
  deleteGainCreator,
  formPosition = 'bottom'
}: ValueMapCanvasProps) => {
  // Track active tab
  const [activeTab, setActiveTab] = useState<string>("services");
  
  // Calculate counts for each section
  const servicesCount = canvas.productServices.length;
  const relieversCount = canvas.painRelievers.length;
  const creatorsCount = canvas.gainCreators.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Value Map</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <div className="space-y-2">
                <p className="font-medium">What is the Value Map?</p>
                <p className="text-sm">
                  The Value Map describes how your products and services create value 
                  for your customers by relieving their pains and creating gains. This 
                  helps you align your offerings with what your customers truly need.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        defaultValue="services" 
        className="mt-6"
      >
        <TabsList activeTab={activeTab}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="services">
                  Products & Services
                  {servicesCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-blue-100 text-xs text-blue-800">
                      {servicesCount}
                    </span>
                  )}
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-sm">Define what your company offers to help customers complete their jobs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="relievers">
                  Pain Relievers
                  {relieversCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-100 text-xs text-red-800">
                      {relieversCount}
                    </span>
                  )}
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-sm">How your offerings solve customer problems</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="creators">
                  Gain Creators
                  {creatorsCount > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-green-100 text-xs text-green-800">
                      {creatorsCount}
                    </span>
                  )}
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-sm">How your offerings create additional value for customers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>
        
        <TabsContent value="services" className="mt-4 p-4 bg-slate-50 rounded-md">
          <ProductServices 
            services={canvas.productServices}
            jobs={canvas.customerJobs}
            onAdd={addProductService}
            onUpdate={updateProductService}
            onDelete={deleteProductService}
            formPosition={formPosition}
          />
        </TabsContent>
        
        <TabsContent value="relievers" className="mt-4 p-4 bg-slate-50 rounded-md">
          <PainRelievers
            relievers={canvas.painRelievers}
            pains={canvas.customerPains}
            onAdd={addPainReliever}
            onUpdate={updatePainReliever}
            onDelete={deletePainReliever}
            formPosition={formPosition}
          />
        </TabsContent>
        
        <TabsContent value="creators" className="mt-4 p-4 bg-slate-50 rounded-md">
          <GainCreators
            creators={canvas.gainCreators}
            gains={canvas.customerGains}
            onAdd={addGainCreator}
            onUpdate={updateGainCreator}
            onDelete={deleteGainCreator}
            formPosition={formPosition}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValueMapCanvas;
