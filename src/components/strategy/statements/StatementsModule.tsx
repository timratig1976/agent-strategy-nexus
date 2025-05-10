
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useStatementsData, useStatementsGenerator } from './hooks';
import { StatementsHeader, StatementsFooter, StatementsList, StatementsAIGenerator } from './components';
import { useStrategyNavigation } from '@/hooks/useStrategyNavigation';
import { StrategyState } from '@/types/marketing';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface StatementsModuleProps {
  strategy: any;  // Strategy object
  uspCanvasData?: any;  // USP Canvas data to use for generation
}

const StatementsModule: React.FC<StatementsModuleProps> = ({
  strategy,
  uspCanvasData
}) => {
  const navigate = useNavigate();
  const strategyId = strategy?.id;
  const [activeTab, setActiveTab] = useState<string>('pain');
  const [uspData, setUspData] = useState<any>(uspCanvasData);
  
  // Hooks for data management and navigation
  const { 
    painStatements, 
    gainStatements,
    isLoading,
    isSaving,
    hasChanges,
    addPainStatement,
    addGainStatement,
    deletePainStatement,
    deleteGainStatement,
    saveStatements
  } = useStatementsData({ strategyId });
  
  const { navigateToPreviousStep, navigateToNextStep, isNavigating } = useStrategyNavigation({
    strategyId,
    onRefetch: () => {
      // Navigate to new URL after state change
      navigate(`/strategy/${strategyId}`);
    }
  });
  
  const { 
    generateStatements, 
    isGenerating, 
    progressPercent 
  } = useStatementsGenerator({ strategyId });

  // Fetch USP Canvas data if not provided
  useEffect(() => {
    if (!strategyId || uspData) return;

    const fetchUspData = async () => {
      try {
        // Check if there's canvas history data for this strategy
        const { data: canvasData, error: canvasError } = await supabase
          .from('canvas_history')
          .select('*')
          .eq('canvas_id', strategyId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (canvasError) {
          console.error('Error fetching canvas data:', canvasError);
          return;
        }

        if (canvasData && canvasData.length > 0) {
          setUspData(canvasData[0].snapshot_data);
        }
      } catch (error) {
        console.error('Error in fetchUspData:', error);
      }
    };

    fetchUspData();
  }, [strategyId, uspData]);

  // Handle AI generation
  const handleGenerate = useCallback(async () => {
    if (!uspData) {
      toast.error('No USP Canvas data available for generation');
      return { painStatements: [], gainStatements: [] };
    }

    return await generateStatements(uspData);
  }, [generateStatements, uspData]);

  // Handle adding all generated statements
  const handleAddGeneratedStatements = useCallback((painStmts: any[], gainStmts: any[]) => {
    // Add pain statements
    painStmts.forEach(item => {
      addPainStatement(item.content, item.impact, true);
    });
    
    // Add gain statements
    gainStmts.forEach(item => {
      addGainStatement(item.content, item.impact, true);
    });
    
    // Switch to pain tab to show added statements
    setActiveTab('pain');
  }, [addPainStatement, addGainStatement]);

  // Handle navigation back to USP Canvas
  const handleNavigateBack = useCallback(() => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }
    
    // Check for unsaved changes
    if (hasChanges) {
      if (confirm('You have unsaved changes. Do you want to save before going back?')) {
        saveStatements().then(() => {
          navigateToPreviousStep(StrategyState.STATEMENTS);
        });
      } else {
        navigateToPreviousStep(StrategyState.STATEMENTS);
      }
    } else {
      navigateToPreviousStep(StrategyState.STATEMENTS);
    }
  }, [strategyId, hasChanges, saveStatements, navigateToPreviousStep]);

  // Handle navigation to Funnel Strategy
  const handleContinue = useCallback(() => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }
    
    // Check for unsaved changes
    if (hasChanges) {
      toast.error('Please save your changes before continuing');
      return;
    }
    
    navigateToNextStep(StrategyState.STATEMENTS);
  }, [strategyId, hasChanges, navigateToNextStep]);

  // Handle save with confirmation of continued navigation
  const handleSaveAndContinue = useCallback(async () => {
    if (!strategyId) {
      toast.error('Strategy ID is missing');
      return;
    }
    
    try {
      await saveStatements();
      handleContinue();
    } catch (error) {
      console.error('Error saving statements:', error);
      toast.error('Failed to save statements');
    }
  }, [strategyId, saveStatements, handleContinue]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading statements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <Card className="overflow-hidden">
        <StatementsHeader
          onNavigateBack={handleNavigateBack}
          isNavigating={isNavigating}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          {/* Left column: AI Generator */}
          <div className="md:col-span-4">
            <StatementsAIGenerator
              onGenerate={handleGenerate}
              onAddStatements={handleAddGeneratedStatements}
              isGenerating={isGenerating}
              progress={progressPercent}
              disabled={!uspData}
            />
          </div>
          
          {/* Right column: Tabs with statements lists */}
          <div className="md:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-6">
                <TabsTrigger value="pain" className="flex-1">
                  Pain Statements ({painStatements.length})
                </TabsTrigger>
                <TabsTrigger value="gain" className="flex-1">
                  Gain Statements ({gainStatements.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pain">
                <StatementsList
                  title="Pain Statements"
                  statements={painStatements}
                  onAddStatement={(content, impact) => addPainStatement(content, impact)}
                  onDeleteStatement={deletePainStatement}
                  placeholder="Enter a pain statement that describes your customers' frustrations..."
                />
              </TabsContent>
              
              <TabsContent value="gain">
                <StatementsList
                  title="Gain Statements"
                  statements={gainStatements}
                  onAddStatement={(content, impact) => addGainStatement(content, impact)}
                  onDeleteStatement={deleteGainStatement}
                  placeholder="Enter a gain statement that describes your customers' desired outcomes..."
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <StatementsFooter
          onSave={saveStatements}
          onContinue={handleSaveAndContinue}
          isSaving={isSaving}
          hasChanges={hasChanges}
          isNavigating={isNavigating}
          canContinue={painStatements.length > 0 || gainStatements.length > 0}
        />
      </Card>
    </div>
  );
};

export default StatementsModule;
