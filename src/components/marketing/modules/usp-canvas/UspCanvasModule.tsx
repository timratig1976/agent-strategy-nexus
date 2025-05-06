
import React from "react";
import { LayoutDashboard, Save, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUspCanvas } from "./useUspCanvas";
import CustomerProfileCanvas from "./CustomerProfileCanvas";
import ValueMapCanvas from "./ValueMapCanvas";
import UspCanvasOverview from "./UspCanvasOverview";

const UspCanvasModule = () => {
  const {
    canvas,
    activeTab,
    setActiveTab,
    isSaved,
    saveProgress,
    // Customer Profile
    addCustomerJob,
    updateCustomerJob,
    deleteCustomerJob,
    addCustomerPain,
    updateCustomerPain,
    deleteCustomerPain,
    addCustomerGain,
    updateCustomerGain,
    deleteCustomerGain,
    // Value Map
    addProductService,
    updateProductService,
    deleteProductService,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator,
    // Canvas management
    saveCanvas,
    resetCanvas
  } = useUspCanvas();

  const hasCustomerData = canvas.customerJobs.length > 0 || 
                          canvas.customerPains.length > 0 || 
                          canvas.customerGains.length > 0;
                          
  const hasValueMapData = canvas.productServices.length > 0 || 
                         canvas.painRelievers.length > 0 || 
                         canvas.gainCreators.length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <LayoutDashboard className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">USP Canvas Builder</h2>
          <p className="text-muted-foreground mt-1">
            Build a unique selling proposition canvas using the Value Proposition Canvas methodology
          </p>
        </div>
      </div>

      {/* Save controls */}
      <div className="mb-8 flex justify-between items-center">
        <div className="flex space-x-3">
          <Button 
            onClick={saveCanvas}
            disabled={isSaved || saveProgress > 0}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Canvas</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={resetCanvas}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>
        
        {saveProgress > 0 && !isSaved && (
          <div className="flex items-center space-x-3 w-64">
            <Progress value={saveProgress} className="w-full" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">{saveProgress}%</span>
          </div>
        )}
        
        {isSaved && (
          <div className="text-sm text-green-600">
            Canvas saved successfully!
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="customer-profile">Customer Profile</TabsTrigger>
          <TabsTrigger value="value-map">Value Map</TabsTrigger>
          <TabsTrigger value="overview" disabled={!hasCustomerData && !hasValueMapData}>
            Canvas Overview
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="customer-profile" className="mt-6">
          <CustomerProfileCanvas
            canvas={canvas}
            addCustomerJob={addCustomerJob}
            updateCustomerJob={updateCustomerJob}
            deleteCustomerJob={deleteCustomerJob}
            addCustomerPain={addCustomerPain}
            updateCustomerPain={updateCustomerPain}
            deleteCustomerPain={deleteCustomerPain}
            addCustomerGain={addCustomerGain}
            updateCustomerGain={updateCustomerGain}
            deleteCustomerGain={deleteCustomerGain}
          />
        </TabsContent>
        
        <TabsContent value="value-map" className="mt-6">
          <ValueMapCanvas
            canvas={canvas}
            addProductService={addProductService}
            updateProductService={updateProductService}
            deleteProductService={deleteProductService}
            addPainReliever={addPainReliever}
            updatePainReliever={updatePainReliever}
            deletePainReliever={deletePainReliever}
            addGainCreator={addGainCreator}
            updateGainCreator={updateGainCreator}
            deleteGainCreator={deleteGainCreator}
          />
        </TabsContent>
        
        <TabsContent value="overview" className="mt-6">
          <UspCanvasOverview canvas={canvas} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UspCanvasModule;
