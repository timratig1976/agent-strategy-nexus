
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Strategy } from '@/types/marketing';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import useStatementsData from './hooks/useStatementsData';
import useStatementsGenerator from './hooks/useStatementsGenerator';
import useStrategyNavigation from '@/hooks/useStrategyNavigation';
import CanvasNavigation from '@/components/marketing/modules/usp-canvas/components/CanvasNavigation';
import UspCanvasDataPanel from './components/UspCanvasDataPanel';
import StatementsAIGenerator from './components/StatementsAIGenerator';
import StatementsDisplay from './components/StatementsDisplay';
import AddStatementForm from './components/AddStatementForm';

interface StatementsModuleProps {
  strategy: Strategy;
}

const StatementsModule: React.FC<StatementsModuleProps> = ({ strategy }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'pain' | 'gain'>('pain');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Use our hooks
  const {
    painStatements,
    gainStatements,
    addPainStatement,
    addGainStatement,
    updatePainStatement,
    updateGainStatement,
    deletePainStatement,
    deleteGainStatement,
    saveStatements,
    isLoading: isLoadingStatements,
    error: statementsError
  } = useStatementsData({ strategyId: strategy.id });
  
  const {
    generateStatements,
    isGenerating,
    progress,
    error: generationError,
    uspCanvasData,
    isLoadingCanvasData
  } = useStatementsGenerator(strategy.id);

  const { navigateToNextStep, navigateToPreviousStep } = useStrategyNavigation({
    strategyId: strategy.id
  });
  
  // Show errors via toast
  useEffect(() => {
    if (statementsError) {
      toast.error(`Error loading statements: ${statementsError.message}`);
    }
    
    if (generationError) {
      toast.error(`Error generating statements: ${generationError}`);
    }
  }, [statementsError, generationError]);

  // Handle statement generation
  const handleGenerateStatements = useCallback(async (customPrompt?: string) => {
    try {
      return await generateStatements(customPrompt || '');
    } catch (error) {
      console.error('Error in generation:', error);
      return { painStatements: [], gainStatements: [] };
    }
  }, [generateStatements]);

  // Handle adding AI generated statements
  const handleAddGeneratedStatements = useCallback((generatedPainStatements: any[], generatedGainStatements: any[]) => {
    // Add all pain statements
    generatedPainStatements.forEach(statement => {
      addPainStatement(statement.content, statement.impact, true);
    });
    
    // Add all gain statements
    generatedGainStatements.forEach(statement => {
      addGainStatement(statement.content, statement.impact, true);
    });
  }, [addPainStatement, addGainStatement]);

  // Save statements and move to next step
  const handleSaveAndContinue = useCallback(async () => {
    setIsLoading(true);
    try {
      await saveStatements();
      toast.success('Statements saved successfully');
      navigateToNextStep();
    } catch (error) {
      toast.error('Failed to save statements');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [saveStatements, navigateToNextStep]);
  
  // Handle navigation back to previous step
  const handleNavigateBack = useCallback(() => {
    navigateToPreviousStep();
  }, [navigateToPreviousStep]);

  // Just save statements without navigation
  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      await saveStatements();
      toast.success('Statements saved successfully');
    } catch (error) {
      toast.error('Failed to save statements');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [saveStatements]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column: USP Canvas Data and AI Generator */}
        <div className="w-full lg:w-1/3 space-y-6">
          <UspCanvasDataPanel 
            uspCanvasData={uspCanvasData}
            isLoading={isLoadingCanvasData}
          />
          
          <StatementsAIGenerator
            onGenerate={handleGenerateStatements}
            onAddStatements={handleAddGeneratedStatements}
            isGenerating={isGenerating}
            progress={progress}
            disabled={isLoadingCanvasData || !uspCanvasData}
          />
          
          <AddStatementForm 
            type={activeTab}
            onAdd={activeTab === 'pain' ? addPainStatement : addGainStatement}
          />
        </div>
        
        {/* Right column: Statements Display */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-md border mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Pain & Gain Statements</h2>
              <p className="text-sm text-gray-500 mt-1">
                Create compelling statements that address customer pains and desires for use in your marketing materials.
              </p>
            </div>
            
            <Tabs defaultValue="pain" className="p-4" onValueChange={(v) => setActiveTab(v as 'pain' | 'gain')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pain">
                  Pain Statements
                  <Badge className="ml-2 bg-red-100 text-red-800 hover:bg-red-100">
                    {painStatements.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="gain">
                  Gain Statements
                  <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                    {gainStatements.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pain" className="pt-4">
                <StatementsDisplay
                  painStatements={painStatements}
                  gainStatements={gainStatements}
                  onUpdatePainStatement={updatePainStatement}
                  onUpdateGainStatement={updateGainStatement}
                  onDeletePainStatement={deletePainStatement}
                  onDeleteGainStatement={deleteGainStatement}
                  activeTab="pain"
                />
              </TabsContent>
              
              <TabsContent value="gain" className="pt-4">
                <StatementsDisplay
                  painStatements={painStatements}
                  gainStatements={gainStatements}
                  onUpdatePainStatement={updatePainStatement}
                  onUpdateGainStatement={updateGainStatement}
                  onDeletePainStatement={deletePainStatement}
                  onDeleteGainStatement={deleteGainStatement}
                  activeTab="gain"
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Statements
            </Button>
            
            <CanvasNavigation 
              onNavigateBack={handleNavigateBack}
              onFinalize={handleSaveAndContinue}
              canFinalize={painStatements.length > 0 && gainStatements.length > 0}
              prevStageLabel="Back to USP Canvas"
              nextStageLabel="Continue to Channel Strategy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementsModule;
