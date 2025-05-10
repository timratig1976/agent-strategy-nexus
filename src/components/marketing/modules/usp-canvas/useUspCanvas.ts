import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UspCanvas, CanvasHistoryEntry, StoredAIResult } from "./types";

// Define the shape of the initial empty canvas
const emptyCanvas: UspCanvas = {
  customerProfile: {
    customerJobs: [],
    customerPains: [],
    customerGains: [],
  },
  valueMap: {
    productServices: [],
    painRelievers: [],
    gainCreators: [],
  },
};

export const useUspCanvas = (strategyId: string, defaultActiveTab: string = "editor") => {
  const [canvas, setCanvas] = useState<UspCanvas>({ ...emptyCanvas });
  const [activeTab, setActiveTab] = useState<string>(defaultActiveTab);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [canvasSaveHistory, setCanvasSaveHistory] = useState<CanvasHistoryEntry[]>([]);

  // Fetch canvas data on initial load
  useEffect(() => {
    if (strategyId) {
      fetchCanvasData();
    }
  }, [strategyId]);

  // Function to fetch canvas data from database
  const fetchCanvasData = async () => {
    try {
      setIsLoading(true);
      
      // First, try to get the latest final version of canvas
      const { data: agentResults, error: resultsError } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('metadata->type', 'pain_gains')
        .eq('metadata->is_final', true)
        .order('created_at', { ascending: false });

      if (resultsError) throw resultsError;

      if (agentResults && agentResults.length > 0) {
        // We found a final version
        try {
          const canvasData = JSON.parse(agentResults[0].content);
          setCanvas(canvasData);
          
          // Also load the save history
          loadCanvasSaveHistory();
        } catch (e) {
          console.error("Error parsing canvas data:", e);
          setError("Failed to parse saved canvas data");
        }
      } else {
        // If no final version found, try to get the latest draft/working version
        const { data: draftResults, error: draftError } = await supabase
          .from('agent_results')
          .select('*')
          .eq('strategy_id', strategyId)
          .eq('metadata->type', 'pain_gains')
          .order('created_at', { ascending: false });
          
        if (draftError) throw draftError;
        
        if (draftResults && draftResults.length > 0) {
          try {
            const canvasData = JSON.parse(draftResults[0].content);
            setCanvas(canvasData);
            
            // Also load the save history
            loadCanvasSaveHistory();
          } catch (e) {
            console.error("Error parsing draft canvas data:", e);
            setError("Failed to parse saved canvas draft");
          }
        } else {
          // If no canvas data found at all, use the empty canvas template
          setCanvas({ ...emptyCanvas });
        }
      }
    } catch (err) {
      console.error("Error fetching canvas data:", err);
      setError("Failed to load canvas data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load canvas save history
  const loadCanvasSaveHistory = async () => {
    try {
      const { data: historyResults, error: historyError } = await supabase
        .from('agent_results')
        .select('*')
        .eq('strategy_id', strategyId)
        .eq('metadata->type', 'pain_gains')
        .order('created_at', { ascending: false });
        
      if (historyError) throw historyError;
      
      if (historyResults) {
        const history: CanvasHistoryEntry[] = historyResults.map(result => ({
          id: result.id,
          date: new Date(result.created_at),
          isFinal: result.metadata?.is_final === true,
          canvasData: JSON.parse(result.content),
          metadata: result.metadata
        }));
        
        setCanvasSaveHistory(history);
      }
    } catch (err) {
      console.error("Error loading canvas history:", err);
    }
  };

  // Function to refresh canvas data
  const refreshCanvasData = async () => {
    fetchCanvasData();
  };
  
  // Add a new customer job
  const addCustomerJob = useCallback((content: string, priority: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newJob = { id: uuidv4(), content, priority, isAIGenerated };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerJobs: [...prevCanvas.customerProfile.customerJobs, newJob],
      },
    }));
    setIsSaved(false);
  }, []);

  // Update an existing customer job
  const updateCustomerJob = useCallback((id: string, content: string, priority: 'low' | 'medium' | 'high') => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerJobs: prevCanvas.customerProfile.customerJobs.map(job =>
          job.id === id ? { ...job, content, priority } : job
        ),
      },
    }));
    setIsSaved(false);
  }, []);

  // Delete a customer job
  const deleteCustomerJob = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerJobs: prevCanvas.customerProfile.customerJobs.filter(job => job.id !== id),
      },
    }));
    setIsSaved(false);
  }, []);

  // Reorder customer jobs
  const reorderCustomerJobs = useCallback((reorderedJobs: any[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerJobs: reorderedJobs,
      },
    }));
    setIsSaved(false);
  }, []);

  // Add a new customer pain
  const addCustomerPain = useCallback((content: string, severity: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newPain = { id: uuidv4(), content, severity, isAIGenerated };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerPains: [...prevCanvas.customerProfile.customerPains, newPain],
      },
    }));
    setIsSaved(false);
  }, []);

  // Update an existing customer pain
  const updateCustomerPain = useCallback((id: string, content: string, severity: 'low' | 'medium' | 'high') => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerPains: prevCanvas.customerProfile.customerPains.map(pain =>
          pain.id === id ? { ...pain, content, severity } : pain
        ),
      },
    }));
    setIsSaved(false);
  }, []);

  // Delete a customer pain
  const deleteCustomerPain = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerPains: prevCanvas.customerProfile.customerPains.filter(pain => pain.id !== id),
      },
    }));
    setIsSaved(false);
  }, []);

  // Reorder customer pains
  const reorderCustomerPains = useCallback((reorderedPains: any[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerPains: reorderedPains,
      },
    }));
    setIsSaved(false);
  }, []);

  // Add a new customer gain
  const addCustomerGain = useCallback((content: string, importance: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    const newGain = { id: uuidv4(), content, importance, isAIGenerated };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerGains: [...prevCanvas.customerProfile.customerGains, newGain],
      },
    }));
    setIsSaved(false);
  }, []);

  // Update an existing customer gain
  const updateCustomerGain = useCallback((id: string, content: string, importance: 'low' | 'medium' | 'high') => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerGains: prevCanvas.customerProfile.customerGains.map(gain =>
          gain.id === id ? { ...gain, content, importance } : gain
        ),
      },
    }));
    setIsSaved(false);
  }, []);

  // Delete a customer gain
  const deleteCustomerGain = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerGains: prevCanvas.customerProfile.customerGains.filter(gain => gain.id !== id),
      },
    }));
    setIsSaved(false);
  }, []);

  // Reorder customer gains
  const reorderCustomerGains = useCallback((reorderedGains: any[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      customerProfile: {
        ...prevCanvas.customerProfile,
        customerGains: reorderedGains,
      },
    }));
    setIsSaved(false);
  }, []);

  // Add a new product/service
  const addProductService = useCallback((content: string, relatedJobIds: string[]) => {
    const newProductService = { id: uuidv4(), content, relatedJobIds };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        productServices: [...prevCanvas.valueMap.productServices, newProductService],
      },
    }));
    setIsSaved(false);
  }, []);

  // Update an existing product/service
  const updateProductService = useCallback((id: string, content: string, relatedJobIds: string[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        productServices: prevCanvas.valueMap.productServices.map(productService =>
          productService.id === id ? { ...productService, content, relatedJobIds } : productService
        ),
      },
    }));
    setIsSaved(false);
  }, []);

  // Delete a product/service
  const deleteProductService = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        productServices: prevCanvas.valueMap.productServices.filter(productService => productService.id !== id),
      },
    }));
    setIsSaved(false);
  }, []);

  // Add a new pain reliever
  const addPainReliever = useCallback((content: string, relatedPainIds: string[]) => {
    const newPainReliever = { id: uuidv4(), content, relatedPainIds };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        painRelievers: [...prevCanvas.valueMap.painRelievers, newPainReliever],
      },
    }));
    setIsSaved(false);
  }, []);

  // Update an existing pain reliever
  const updatePainReliever = useCallback((id: string, content: string, relatedPainIds: string[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        painRelievers: prevCanvas.valueMap.painRelievers.map(painReliever =>
          painReliever.id === id ? { ...painReliever, content, relatedPainIds } : painReliever
        ),
      },
    }));
    setIsSaved(false);
  }, []);

  // Delete a pain reliever
  const deletePainReliever = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        painRelievers: prevCanvas.valueMap.painRelievers.filter(painReliever => painReliever.id !== id),
      },
    }));
    setIsSaved(false);
  }, []);

  // Add a new gain creator
  const addGainCreator = useCallback((content: string, relatedGainIds: string[]) => {
    const newGainCreator = { id: uuidv4(), content, relatedGainIds };
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        gainCreators: [...prevCanvas.valueMap.gainCreators, newGainCreator],
      },
    }));
    setIsSaved(false);
  }, []);

  // Update an existing gain creator
  const updateGainCreator = useCallback((id: string, content: string, relatedGainIds: string[]) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        gainCreators: prevCanvas.valueMap.gainCreators.map(gainCreator =>
          gainCreator.id === id ? { ...gainCreator, content, relatedGainIds } : gainCreator
        ),
      },
    }));
    setIsSaved(false);
  }, []);

  // Delete a gain creator
  const deleteGainCreator = useCallback((id: string) => {
    setCanvas(prevCanvas => ({
      ...prevCanvas,
      valueMap: {
        ...prevCanvas.valueMap,
        gainCreators: prevCanvas.valueMap.gainCreators.filter(gainCreator => gainCreator.id !== id),
      },
    }));
    setIsSaved(false);
  }, []);
  
  // Save progress
  const saveProgress = useCallback(async () => {
    await saveCanvas();
  }, [canvas, strategyId]);

  // Apply AI generated content
  const applyAIGeneratedContent = useCallback(async (aiResult: StoredAIResult) => {
    if (!aiResult) return;

    // Helper function to map AI results to canvas items
    const mapAIResults = (items: any[], addItem: (content: string, priority: any, isAIGenerated: boolean) => void, priorityKey: string) => {
      items?.forEach(item => {
        addItem(item.description || item.title, item[priorityKey] || 'medium', true);
      });
    };

    // Apply AI generated jobs
    mapAIResults(aiResult.jobs, addCustomerJob, 'priority');

    // Apply AI generated pains
    mapAIResults(aiResult.pains, addCustomerPain, 'severity');

    // Apply AI generated gains
    mapAIResults(aiResult.gains, addCustomerGain, 'importance');
  }, [addCustomerJob, addCustomerPain, addCustomerGain]);
  
  // Save the canvas as final version
  const saveFinalVersion = useCallback(() => {
    if (!strategyId) return false;
    
    try {
      saveCanvas(true);
      return true;
    } catch (err) {
      console.error("Error saving final canvas:", err);
      toast.error("Failed to save final canvas");
      return false;
    }
  }, [canvas, strategyId]);
  
  // Save the canvas with specified final status
  const saveCanvas = useCallback(async (isFinal: boolean = false) => {
    if (!strategyId) return;
    
    try {
      // Save the current state to the database
      const { error } = await supabase
        .from('agent_results')
        .insert({
          strategy_id: strategyId,
          content: JSON.stringify(canvas),
          metadata: {
            type: 'pain_gains',
            is_final: isFinal,
            updated_at: new Date().toISOString()
          }
        });
      
      if (error) throw error;
      
      setIsSaved(true);
      toast.success(isFinal ? "Canvas saved as final version!" : "Canvas saved!");
      
      // Refresh the save history
      loadCanvasSaveHistory();
    } catch (err) {
      console.error("Error saving canvas:", err);
      toast.error("Failed to save canvas");
    }
  }, [canvas, strategyId]);

  return {
    canvas,
    activeTab,
    setActiveTab,
    isSaved,
    saveCanvas,
    resetCanvas: () => setCanvas({ ...emptyCanvas }),
    canvasSaveHistory,
    saveFinalVersion,
    isLoading,
    error,
    refreshCanvasData,
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
    addProductService,
    updateProductService,
    deleteProductService,
    addPainReliever,
    updatePainReliever,
    deletePainReliever,
    addGainCreator,
    updateGainCreator,
    deleteGainCreator,
    saveProgress,
    applyAIGeneratedContent,
  };
};
