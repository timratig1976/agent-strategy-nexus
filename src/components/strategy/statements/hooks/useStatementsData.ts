
import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { PainStatement, GainStatement, UseStatementsDataProps, UseStatementsDataReturn } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const useStatementsData = ({ strategyId }: UseStatementsDataProps): UseStatementsDataReturn => {
  const [painStatements, setPainStatements] = useState<PainStatement[]>([]);
  const [gainStatements, setGainStatements] = useState<GainStatement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load statements from database
  useEffect(() => {
    const fetchStatements = async () => {
      if (!strategyId) return;

      try {
        setIsLoading(true);
        
        // Fetch strategy data
        const { data, error } = await supabase
          .from('strategies')
          .select('*')
          .eq('id', strategyId)
          .single();
          
        if (error) throw error;
        
        // Extract statements from metadata
        if (data) {
          // Handle both direct metadata property or using the strategy_metadata table
          const metadata = (data as any).metadata || {};
          setPainStatements(metadata.painStatements || []);
          setGainStatements(metadata.gainStatements || []);
        } else {
          // Initialize with empty arrays if no metadata
          setPainStatements([]);
          setGainStatements([]);
        }
      } catch (err: any) {
        console.error("Error fetching statements:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStatements();
  }, [strategyId]);

  // Add pain statement
  const addPainStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high', isAIGenerated = false) => {
    const newStatement: PainStatement = {
      id: uuidv4(),
      content,
      impact,
      isAIGenerated,
      createdAt: new Date().toISOString()
    };
    
    setPainStatements(prev => [...prev, newStatement]);
  }, []);
  
  // Add gain statement
  const addGainStatement = useCallback((content: string, impact: 'low' | 'medium' | 'high', isAIGenerated = false) => {
    const newStatement: GainStatement = {
      id: uuidv4(),
      content,
      impact,
      isAIGenerated,
      createdAt: new Date().toISOString()
    };
    
    setGainStatements(prev => [...prev, newStatement]);
  }, []);
  
  // Update pain statement
  const updatePainStatement = useCallback((id: string, updates: Partial<PainStatement>) => {
    setPainStatements(prev => 
      prev.map(statement => 
        statement.id === id ? { ...statement, ...updates } : statement
      )
    );
  }, []);
  
  // Update gain statement
  const updateGainStatement = useCallback((id: string, updates: Partial<GainStatement>) => {
    setGainStatements(prev => 
      prev.map(statement => 
        statement.id === id ? { ...statement, ...updates } : statement
      )
    );
  }, []);
  
  // Delete pain statement
  const deletePainStatement = useCallback((id: string) => {
    setPainStatements(prev => prev.filter(statement => statement.id !== id));
  }, []);
  
  // Delete gain statement
  const deleteGainStatement = useCallback((id: string) => {
    setGainStatements(prev => prev.filter(statement => statement.id !== id));
  }, []);

  // Save statements to database
  const saveStatements = useCallback(async () => {
    if (!strategyId) return;
    
    try {
      // First get existing data
      const { data, error: fetchError } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', strategyId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update data with statements
      const updatedMetadata = {
        ...((data as any)?.metadata || {}),
        painStatements,
        gainStatements
      };
      
      // Save updated metadata
      const { error: updateError } = await supabase
        .from('strategies')
        .update({ 
          metadata: updatedMetadata 
        } as any)
        .eq('id', strategyId);
        
      if (updateError) throw updateError;
      
      toast.success("Statements saved successfully");
    } catch (err: any) {
      console.error("Error saving statements:", err);
      toast.error("Failed to save statements");
      throw err;
    }
  }, [strategyId, painStatements, gainStatements]);
  
  return {
    painStatements,
    gainStatements,
    addPainStatement,
    addGainStatement,
    updatePainStatement,
    updateGainStatement,
    deletePainStatement,
    deleteGainStatement,
    saveStatements,
    isLoading,
    error
  };
};
