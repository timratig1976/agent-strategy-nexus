import React, { useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  Edge,
  Node,
  ConnectionLineType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Download, FileText, User, FlaskConical, BarChart2, MessageSquare, X } from "lucide-react";
import { AgentResult, StrategyState } from "@/types/marketing";
import { getStateLabel } from "@/utils/strategyUtils";
import UspCanvasBoard from "@/components/marketing/modules/usp-canvas/visualization/UspCanvasBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatContentForDisplay, extractUspCanvasFromAgentResult, createSampleUspCanvas } from "@/utils/canvasVisualizationHelpers";
import DetailedContentViewer from './components/DetailedContentViewer';

// Custom node components
import StageNode from './nodes/StageNode';
import ResultNode from './nodes/ResultNode';
import StrategyNode from './nodes/StrategyNode';

interface StrategyBoardProps {
  strategyId: string;
  agentResults?: AgentResult[];
  currentStage?: StrategyState;
}

// Define node types outside the component to avoid re-creation on each render
const nodeTypes: NodeTypes = {
  stageNode: StageNode,
  resultNode: ResultNode,
  strategyNode: StrategyNode
};

const StrategyBoard: React.FC<StrategyBoardProps> = ({
  strategyId,
  agentResults = [],
  currentStage
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<AgentResult | null>(null);
  const [canvasDialogOpen, setCanvasDialogOpen] = useState<boolean>(false);
  
  // Get the USP Canvas result specifically
  const uspCanvasResult = agentResults.find(r => 
    r.metadata?.is_final === true && r.metadata?.type === 'pain_gains'
  );

  // Define stages in order - memoize to prevent recreation
  const stages = useMemo(() => [
    StrategyState.BRIEFING, 
    StrategyState.PERSONA, 
    StrategyState.PAIN_GAINS, 
    StrategyState.FUNNEL, 
    StrategyState.ADS
  ], []);

  // Set up initial nodes and edges based on strategy data
  useEffect(() => {
    if (!strategyId) return;

    const generateNodesAndEdges = async () => {
      setIsLoading(true);
      
      // Get final results for each stage
      const briefingResult = agentResults.find(r => 
        r.metadata?.is_final === true && (!r.metadata?.type || r.metadata?.type === 'briefing')
      );
      
      const personaResult = agentResults.find(r => 
        r.metadata?.is_final === true && r.metadata?.type === 'persona'
      );
      
      const uspResult = agentResults.find(r => 
        r.metadata?.is_final === true && r.metadata?.type === 'pain_gains'
      );
      
      const funnelResult = agentResults.find(r => 
        r.metadata?.is_final === true && r.metadata?.type === 'funnel'
      );
      
      const adResult = agentResults.find(r => 
        r.metadata?.is_final === true && r.metadata?.type === 'ads'
      );
      
      // Create nodes for each stage
      const stageNodes: Node[] = stages.map((stage, index) => {
        const isCurrentStage = currentStage === stage;
        const xPos = 100 + index * 250; // Increased spacing between nodes
        
        return {
          id: `stage-${stage}`,
          type: 'strategyNode',
          data: { 
            label: stage === StrategyState.PAIN_GAINS ? "USP Canvas" : getStateLabel(stage),
            icon: getStageIcon(stage),
            isCurrentStage,
            completed: isStageCompleted(stage, currentStage),
          },
          position: { x: xPos, y: 100 },
          style: { 
            width: 150, 
            height: 80,
          }
        };
      });
      
      // Create result nodes where available
      const resultNodes: Node[] = [];
      
      if (briefingResult) {
        resultNodes.push({
          id: `result-briefing`,
          type: 'resultNode',
          data: { 
            label: 'Strategy Briefing',
            content: formatContentForDisplay(briefingResult.content),
            type: 'briefing',
            result: briefingResult,
            onViewDetails: handleViewDetails
          },
          position: { x: 100, y: 250 },
          style: { width: 250, height: 280 }  // Increased size for better readability
        });
      }
      
      if (personaResult) {
        resultNodes.push({
          id: `result-persona`,
          type: 'resultNode',
          data: { 
            label: 'Target Persona',
            content: formatContentForDisplay(personaResult.content),
            type: 'persona',
            result: personaResult,
            onViewDetails: handleViewDetails
          },
          position: { x: 350, y: 250 },
          style: { width: 250, height: 280 }
        });
      }
      
      if (uspResult) {
        resultNodes.push({
          id: `result-usp`,
          type: 'resultNode',
          data: { 
            label: 'USP Canvas',
            content: formatContentForDisplay(uspResult.content),
            type: 'pain_gains',
            result: uspResult,
            onViewDetails: handleViewCanvasDetails
          },
          position: { x: 600, y: 250 },
          style: { width: 250, height: 280 }
        });
      }
      
      if (funnelResult) {
        resultNodes.push({
          id: `result-funnel`,
          type: 'resultNode',
          data: { 
            label: 'Marketing Funnel',
            content: formatContentForDisplay(funnelResult.content),
            type: 'funnel',
            result: funnelResult,
            onViewDetails: handleViewDetails
          },
          position: { x: 850, y: 250 },
          style: { width: 250, height: 280 }
        });
      }
      
      if (adResult) {
        resultNodes.push({
          id: `result-ads`,
          type: 'resultNode',
          data: { 
            label: 'Ad Campaign',
            content: formatContentForDisplay(adResult.content),
            type: 'ads',
            result: adResult,
            onViewDetails: handleViewDetails
          },
          position: { x: 1100, y: 250 },
          style: { width: 250, height: 280 }
        });
      }
      
      setNodes([...stageNodes, ...resultNodes]);
      
      // Connect stage nodes with edges
      const stageEdges: Edge[] = [];
      for (let i = 0; i < stages.length - 1; i++) {
        stageEdges.push({
          id: `edge-${i}-${i+1}`,
          source: `stage-${stages[i]}`,
          target: `stage-${stages[i+1]}`,
          animated: currentStage === stages[i+1], // Animate the edge to the current stage
          style: { 
            stroke: '#888',
            strokeWidth: 2
          }
        });
      }
      
      // Connect stage nodes to their result nodes
      const resultEdges: Edge[] = [];
      resultNodes.forEach(node => {
        const type = node.data.type;
        resultEdges.push({
          id: `edge-${type}-result`,
          source: `stage-${type}`,
          target: node.id,
          type: 'smoothstep',
          style: { stroke: '#bbb' }
        });
      });

      setEdges([...stageEdges, ...resultEdges]);
      setIsLoading(false);
    };

    generateNodesAndEdges();
  }, [strategyId, agentResults, currentStage, stages]);

  // Helper function to check if a stage is completed
  const isStageCompleted = (stage: StrategyState, currentStage?: StrategyState): boolean => {
    if (!currentStage) return false;
    
    const stageIndex = stages.indexOf(stage);
    const currentIndex = stages.indexOf(currentStage);
    
    return stageIndex < currentIndex;
  };

  // Helper function to get icon for a stage
  const getStageIcon = (stage: StrategyState) => {
    switch (stage) {
      case StrategyState.BRIEFING:
        return <FileText size={20} />;
      case StrategyState.PERSONA:
        return <User size={20} />;
      case StrategyState.PAIN_GAINS:
        return <FlaskConical size={20} />;  // Changed from Star to FlaskConical to better represent USP Canvas
      case StrategyState.FUNNEL:
        return <BarChart2 size={20} />;
      case StrategyState.ADS:
        return <MessageSquare size={20} />;
      default:
        return null;
    }
  };

  // Handle viewing of detailed content
  const handleViewDetails = (result: AgentResult) => {
    setSelectedResult(result);
    setShowDetailDialog(true);
  };
  
  // Handle viewing USP Canvas
  const handleViewCanvasDetails = (result: AgentResult) => {
    setSelectedResult(result);
    setCanvasDialogOpen(true);
  };
  
  // Close detail dialog
  const handleCloseDetailDialog = () => {
    setShowDetailDialog(false);
    setSelectedResult(null);
  };
  
  // Close canvas dialog
  const handleCloseCanvasDialog = () => {
    setCanvasDialogOpen(false);
    setSelectedResult(null);
  };

  const handleExport = () => {
    // This will be implemented to export the board as PNG or PDF
    console.log("Export functionality to be implemented");
    // In a full implementation, we would use html-to-image or similar libraries
    // to capture the board content
    alert("Export feature will download the board as an image");
  };
  
  // Handle node click to show details
  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    
    // If it's a result node, also show the detailed view
    if (node.type === 'resultNode') {
      handleViewDetails(node.data.result);
    }
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading strategy visualization...</div>;
  }

  return (
    <div className="w-full h-[800px] border border-gray-200 rounded-md overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        connectionLineType={ConnectionLineType.Bezier}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={4}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
      >
        <Controls />
        <MiniMap 
          nodeBorderRadius={8} 
          nodeColor={(node) => {
            switch (node.data?.type) {
              case 'briefing': return '#60a5fa';
              case 'persona': return '#c084fc';
              case 'pain_gains': return '#fbbf24';
              case 'funnel': return '#34d399';
              case 'ads': return '#f472b6';
              default: return '#94a3b8';
            }
          }}
        />
        <Background gap={16} size={1} />
        
        <Panel position="top-right">
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download size={16} /> Export
          </Button>
        </Panel>
      </ReactFlow>
      
      {/* Detailed Content Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          {selectedResult && (
            <DetailedContentViewer 
              result={selectedResult} 
              onClose={handleCloseDetailDialog}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* USP Canvas Dialog */}
      <Dialog open={canvasDialogOpen} onOpenChange={setCanvasDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0">
          <div className="p-4 bg-white flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold">USP Canvas Visualization</h2>
            <Button variant="ghost" size="icon" onClick={handleCloseCanvasDialog}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-4">
            {selectedResult && (
              <div className="h-[70vh]">
                <UspCanvasBoard
                  canvas={extractUspCanvasFromAgentResult(selectedResult) || createSampleUspCanvas()}
                  readOnly={true}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategyBoard;
