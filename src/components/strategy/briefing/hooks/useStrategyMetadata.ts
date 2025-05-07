
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StrategyFormValues } from "@/components/strategy-form";

export const useStrategyMetadata = (strategyId: string) => {
  // Initialize form values with empty strings and include the strategy id
  const [formValues, setFormValues] = useState<StrategyFormValues & { id: string }>({
    id: strategyId,
    name: "",
    description: "",
    companyName: "",
    websiteUrl: "",
    productDescription: "",
    productUrl: "",
    additionalInfo: ""
  });

  // Fetch strategy metadata on component mount
  useEffect(() => {
    fetchStrategyMetadata();
  }, [strategyId]);
  
  const fetchStrategyMetadata = async () => {
    try {
      console.log("Fetching strategy metadata for ID:", strategyId);
      
      // First check if the strategy has direct properties we can use
      const { data: strategyData, error: strategyError } = await supabase
        .from('strategies')
        .select('name, description, company_name, website_url, product_description, product_url, additional_info')
        .eq('id', strategyId)
        .single();
        
      // Get strategy data values first
      let name = "";
      let description = "";
      let companyName = '';
      let websiteUrl = '';
      let productDescription = '';
      let productUrl = '';
      let additionalInfo = '';
      
      // Set values from strategies table if available
      if (!strategyError && strategyData) {
        console.log("Found strategy data in strategies table:", strategyData);
        name = strategyData.name || '';
        description = strategyData.description || '';
        companyName = strategyData.company_name || '';
        websiteUrl = strategyData.website_url || '';
        productDescription = strategyData.product_description || '';
        productUrl = strategyData.product_url || '';
        additionalInfo = strategyData.additional_info || '';
      }
      
      // Then try to get metadata from the strategy_metadata table via RPC
      const { data, error } = await supabase.rpc(
        'get_strategy_metadata',
        { strategy_id_param: strategyId }
      );
      
      if (error) {
        console.error("RPC error:", error);
        toast.error("Error loading strategy information");
      } else if (data && Array.isArray(data) && data.length > 0) {
        console.log("Metadata response:", data);
        
        // Use metadata values if available (they override strategy table values)
        const metadata = data[0];
        console.log("Setting form values with metadata:", metadata);
        
        // Override values with metadata if they exist
        if (metadata.company_name !== null) companyName = metadata.company_name;
        if (metadata.website_url !== null) websiteUrl = metadata.website_url;
        if (metadata.product_description !== null) productDescription = metadata.product_description;
        if (metadata.product_url !== null) productUrl = metadata.product_url;
        if (metadata.additional_info !== null) additionalInfo = metadata.additional_info;
      }
      
      console.log("Setting final form values:", {
        id: strategyId,
        name,
        description,
        companyName,
        websiteUrl,
        productDescription,
        productUrl,
        additionalInfo
      });
      
      // Set all form values at once with the most up-to-date data
      setFormValues({
        id: strategyId,
        name,
        description,
        companyName,
        websiteUrl,
        productDescription,
        productUrl,
        additionalInfo
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
      
      // Use RPC function to update strategy metadata
      const { error } = await supabase.rpc(
        'upsert_strategy_metadata',
        {
          strategy_id_param: strategyId,
          company_name_param: updatedValues.companyName || '',
          website_url_param: updatedValues.websiteUrl || '',
          product_description_param: updatedValues.productDescription || '',
          product_url_param: updatedValues.productUrl || '',
          additional_info_param: updatedValues.additionalInfo || ''
        }
      );
      
      if (error) {
        console.error("RPC error during save:", error);
        throw error;
      }
      
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
