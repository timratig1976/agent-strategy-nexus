
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { StrategyFormValues } from "@/components/strategy-form";
import { useApiClient } from "@/hooks/useApiClient";

export const useStrategyMetadata = (strategyId: string) => {
  // Initialize form values with empty strings and include the strategy id
  const [formValues, setFormValues] = useState<StrategyFormValues & { id: string }>({
    id: strategyId,
    name: "",
    companyName: "",
    websiteUrl: "",
    productDescription: "",
    productUrl: "",
    additionalInfo: "",
    language: "english"
  });
  const api = useApiClient("");

  // Fetch strategy metadata on component mount
  useEffect(() => {
    fetchStrategyMetadata();
  }, [strategyId]);
  
  const fetchStrategyMetadata = async () => {
    try {
      console.log("Fetching strategy metadata for ID:", strategyId);
      // Call our Vercel API (scaffold returns empty for now)
      const res = await api.get<{ items: any[] }>(`/api/strategy-metadata?strategyId=${encodeURIComponent(strategyId)}`);
      const metadata = Array.isArray(res.items) && res.items.length > 0 ? res.items[0] : null;

      const name = metadata?.name || "";
      const companyName = metadata?.company_name || "";
      const websiteUrl = metadata?.website_url || "";
      const productDescription = metadata?.product_description || "";
      const productUrl = metadata?.product_url || "";
      const additionalInfo = metadata?.additional_info || "";

      setFormValues({
        id: strategyId,
        name,
        companyName,
        websiteUrl,
        productDescription,
        productUrl,
        additionalInfo,
        language: "english"
      });
      
    } catch (error) {
      console.error("Error fetching strategy metadata:", error);
      toast.error("Failed to load strategy information");
    }
  };

  // Function to update strategy metadata
  const saveStrategyMetadata = async (updatedValues: StrategyFormValues): Promise<boolean> => {
    try {
      console.log("Saving strategy metadata for ID:", strategyId, "Values:", updatedValues);
      // Call our Vercel API
      await api.post(`/api/strategy-metadata`, {
        strategyId,
        name: updatedValues.name || '',
        company_name: updatedValues.companyName || '',
        website_url: updatedValues.websiteUrl || '',
        product_description: updatedValues.productDescription || '',
        product_url: updatedValues.productUrl || '',
        additional_info: updatedValues.additionalInfo || ''
      });

      console.log("Strategy metadata updated successfully");
      setFormValues({
        ...updatedValues,
        id: strategyId
      });
      toast.success("Strategy information updated");
      return true;
    } catch (error) {
      console.error("Error updating strategy metadata:", error);
      toast.error("Failed to update strategy information");
      return false;
    }
  };

  return {
    formValues,
    setFormValues,
    saveStrategyMetadata,
    fetchStrategyMetadata
  };
};

