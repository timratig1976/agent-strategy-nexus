
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerJobs from "./CustomerJobs";
import CustomerPains from "./CustomerPains";
import CustomerGains from "./CustomerGains";
import { UspCanvas, CustomerJob, CustomerPain, CustomerGain } from "./types";

interface CustomerProfileCanvasProps {
  canvas: UspCanvas;
  addCustomerJob: (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerJob: (id: string, content: string, priority: 'low' | 'medium' | 'high') => void;
  deleteCustomerJob: (id: string) => void;
  reorderCustomerJobs?: (reorderedJobs: CustomerJob[]) => void;
  addCustomerPain: (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerPain: (id: string, content: string, severity: 'low' | 'medium' | 'high') => void;
  deleteCustomerPain: (id: string) => void;
  reorderCustomerPains?: (reorderedPains: CustomerPain[]) => void;
  addCustomerGain: (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  updateCustomerGain: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  deleteCustomerGain: (id: string) => void;
  reorderCustomerGains?: (reorderedGains: CustomerGain[]) => void;
  formPosition?: 'top' | 'bottom';
}

const CustomerProfileCanvas = ({
  canvas,
  addCustomerJob,
  updateCustomerJob,
  deleteCustomerJob,
  reorderCustomerJobs,
  addCustomerPain,
  updateCustomerPain,
  deleteCustomerPain,
  reorderCustomerPains,
  addCustomerGain,
  updateCustomerGain,
  deleteCustomerGain,
  reorderCustomerGains,
  formPosition = 'bottom'
}: CustomerProfileCanvasProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Customer Profile</h2>
      <p className="text-muted-foreground mb-6">
        Understand your customer's perspective by documenting their jobs, pains, and gains.
        This will help you create a value proposition that resonates with them.
      </p>

      <Tabs defaultValue="jobs" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="pains">Pains</TabsTrigger>
          <TabsTrigger value="gains">Gains</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="mt-4 p-4 bg-slate-50 rounded-md">
          <CustomerJobs 
            jobs={canvas.customerJobs}
            onAdd={addCustomerJob}
            onUpdate={updateCustomerJob}
            onDelete={deleteCustomerJob}
            onReorder={reorderCustomerJobs}
            formPosition={formPosition}
          />
        </TabsContent>
        
        <TabsContent value="pains" className="mt-4 p-4 bg-slate-50 rounded-md">
          <CustomerPains 
            pains={canvas.customerPains}
            onAdd={addCustomerPain}
            onUpdate={updateCustomerPain}
            onDelete={deleteCustomerPain}
            onReorder={reorderCustomerPains}
            formPosition={formPosition}
          />
        </TabsContent>
        
        <TabsContent value="gains" className="mt-4 p-4 bg-slate-50 rounded-md">
          <CustomerGains 
            gains={canvas.customerGains}
            onAdd={addCustomerGain}
            onUpdate={updateCustomerGain}
            onDelete={deleteCustomerGain}
            onReorder={reorderCustomerGains}
            formPosition={formPosition}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerProfileCanvas;
