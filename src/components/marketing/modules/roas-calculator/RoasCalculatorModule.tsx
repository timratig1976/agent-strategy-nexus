
import React from "react";
import { Calculator } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoasCalculatorForm from "./RoasCalculatorForm";
import RoasCalculatorResults from "./RoasCalculatorResults";
import { useRoasCalculator } from "./useRoasCalculator";

const RoasCalculatorModule = () => {
  const {
    formData,
    setFormData,
    results,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    calculateRoas,
    resetCalculator
  } = useRoasCalculator();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <div className="p-2 rounded-md bg-primary/10">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">ROAS Calculator</h2>
          <p className="text-muted-foreground mt-1">
            Calculate return on ad spend and forecast performance across different marketing channels
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="calculator">ROAS Calculator</TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
          <RoasCalculatorForm 
            formData={formData}
            setFormData={setFormData}
            onCalculate={calculateRoas}
            isLoading={isLoading}
            error={error}
          />
        </TabsContent>
        
        <TabsContent value="results">
          <RoasCalculatorResults 
            results={results} 
            onReset={resetCalculator} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoasCalculatorModule;
