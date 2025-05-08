
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductServices from "./ProductServices";
import PainRelievers from "./PainRelievers";
import GainCreators from "./GainCreators";
import { UspCanvas } from "./types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                  Define your value proposition by describing how your products and services address 
                  customer jobs, relieve pains, and create gains that matter to your customers.
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs defaultValue="products" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="products">Products & Services</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">Define what your business offers to help customers complete their jobs</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="pain-relievers">Pain Relievers</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">Describe how your products and services alleviate customer pains</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="gain-creators">Gain Creators</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">Explain how your offerings create customer gains and benefits</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TabsList>
        
        <TabsContent value="products" className="mt-4 p-4 bg-slate-50 rounded-md">
          <ProductServices 
            services={canvas.productServices}
            jobs={canvas.customerJobs}
            onAdd={addProductService}
            onUpdate={updateProductService}
            onDelete={deleteProductService}
            formPosition={formPosition}
          />
        </TabsContent>
        
        <TabsContent value="pain-relievers" className="mt-4 p-4 bg-slate-50 rounded-md">
          <PainRelievers 
            relievers={canvas.painRelievers}
            pains={canvas.customerPains}
            onAdd={addPainReliever}
            onUpdate={updatePainReliever}
            onDelete={deletePainReliever}
            formPosition={formPosition}
          />
        </TabsContent>
        
        <TabsContent value="gain-creators" className="mt-4 p-4 bg-slate-50 rounded-md">
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
