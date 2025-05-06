
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
      // Convert form data to numbers to ensure proper calculations
      const adSpend = Number(formData.adSpend);
      const clicks = Number(formData.clicks);
      const ctr = Number(formData.ctr);
      const conversionRate = Number(formData.conversionRate);
      const averageOrderValue = Number(formData.averageOrderValue);
      const profitMargin = Number(formData.profitMargin);
      const targetRoas = formData.targetRoas ? Number(formData.targetRoas) : undefined;
      
      // Calculate conversions
      const conversions = Math.round(clicks * (conversionRate / 100));
      
      // Calculate revenue
      const revenue = conversions * averageOrderValue;
      
      // Calculate ROAS
      const roas = revenue / adSpend;
      
      // Calculate CPC
      const cpc = adSpend / clicks;
      
      // Calculate CPA
      const cpa = conversions > 0 ? adSpend / conversions : 0;
      
      // Calculate profit
      const profit = revenue * (profitMargin / 100) - adSpend;

      // Set results with proper number types
      const calculatedResults: RoasResults = {
        adSpend,
        clicks,
        ctr,
        conversionRate,
        averageOrderValue,
        profitMargin,
        targetRoas,
        conversions,
        revenue,
        roas,
        cpc,
        cpa,
        profit
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
