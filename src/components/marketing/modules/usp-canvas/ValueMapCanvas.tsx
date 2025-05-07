
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductServices from "./ProductServices";
import PainRelievers from "./PainRelievers";
import GainCreators from "./GainCreators";
import { UspCanvas } from "./types";

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
      <h2 className="text-xl font-semibold mb-4">Value Map</h2>
      <p className="text-muted-foreground mb-6">
        Define your value proposition by describing how your products and services address 
        customer jobs, relieve pains, and create gains that matter to your customers.
      </p>

      <Tabs defaultValue="products" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products & Services</TabsTrigger>
          <TabsTrigger value="pain-relievers">Pain Relievers</TabsTrigger>
          <TabsTrigger value="gain-creators">Gain Creators</TabsTrigger>
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
