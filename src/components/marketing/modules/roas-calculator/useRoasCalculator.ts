
import { useState } from "react";
import { RoasFormData, RoasResults } from "./types";
import { toast } from "@/components/ui/sonner";

export const useRoasCalculator = () => {
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RoasResults | null>(null);
  
  const [formData, setFormData] = useState<RoasFormData>({
    adSpend: 5000,
    clicks: 2500,
    ctr: 2.5,
    conversionRate: 3,
    averageOrderValue: 100,
    profitMargin: 30,
    targetRoas: 2
  });

  const calculateRoas = () => {
    setError(null);
    
    // Validate inputs
    if (!formData.adSpend || formData.adSpend <= 0) {
      setError("Ad spend must be greater than 0");
      return;
    }

    if (!formData.clicks || formData.clicks <= 0) {
      setError("Clicks must be greater than 0");
      return;
    }
    
    if (!formData.conversionRate || formData.conversionRate <= 0) {
      setError("Conversion rate must be greater than 0");
      return;
    }
    
    if (!formData.averageOrderValue || formData.averageOrderValue <= 0) {
      setError("Average order value must be greater than 0");
      return;
    }

    setIsLoading(true);

    try {
      // Calculate conversions
      const conversions = Math.round(formData.clicks * (formData.conversionRate / 100));
      
      // Calculate revenue
      const revenue = conversions * formData.averageOrderValue;
      
      // Calculate ROAS
      const roas = revenue / formData.adSpend;
      
      // Calculate CPC
      const cpc = formData.adSpend / formData.clicks;
      
      // Calculate CPA
      const cpa = conversions > 0 ? formData.adSpend / conversions : 0;
      
      // Calculate profit
      const profit = revenue * (formData.profitMargin / 100) - formData.adSpend;

      // Set results
      const calculatedResults: RoasResults = {
        ...formData,
        conversions,
        revenue,
        roas,
        cpc,
        cpa,
        profit,
      };

      setResults(calculatedResults);
      setActiveTab("results");
      
      toast.success("ROAS calculated successfully");
    } catch (err) {
      setError("An error occurred while calculating ROAS. Please check your inputs.");
      console.error("ROAS calculation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCalculator = () => {
    setActiveTab("calculator");
  };

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    results,
    calculateRoas,
    resetCalculator
  };
};
