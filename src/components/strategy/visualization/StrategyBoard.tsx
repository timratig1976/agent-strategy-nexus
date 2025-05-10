
import React, { useState, useEffect } from 'react';
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
import { Download, FileText, User, Star, BarChart2, MessageSquare } from "lucide-react";
import { AgentResult, StrategyState } from "@/types/marketing";
import { getStateLabel } from "@/utils/strategyUtils";
import UspCanvasBoard from "@/components/marketing/modules/usp-canvas/visualization/UspCanvasBoard"; 

// Custom node components
import StageNode from './nodes/StageNode';
import ResultNode from './nodes/ResultNode';
import StrategyNode from './nodes/StrategyNode';

interface StrategyBoardProps {
  strategyId: string;
  agentResults?: AgentResult[];
  currentStage?: StrategyState;
}

const StrategyBoard: React.FC<StrategyBoardProps> = ({
  strategyId,
  agentResults = [],
  currentStage
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Get the USP Canvas result specifically
  const uspCanvasResult = agentResults.find(r => 
    r.metadata?.is_final === true && r.metadata?.type === 'pain_gains'
  );

  // Define custom node types
  const nodeTypes: NodeTypes = {
    stageNode: StageNode,
    resultNode: ResultNode,
    strategyNode: StrategyNode
  };

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

      // Define stages in order
      const stages: StrategyState[] = ['briefing', 'persona', 'pain_gains', 'funnel', 'ads'];
      
      // Create nodes for each stage
      const stageNodes: Node[] = stages.map((stage, index) => {
        const isCurrentStage = currentStage === stage;
        const xPos = 100 + index * 200;
        
        return {
          id: `stage-${stage}`,
          type: 'strategyNode',
          data: { 
            label: getStateLabel(stage),
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
            label: 'Briefing Summary',
            content: truncateContent(briefingResult.content, 100),
            type: 'briefing',
            result: briefingResult
          },
          position: { x: 100, y: 250 },
          style: { width: 180, height: 160 }
        });
      }
      
      if (personaResult) {
        resultNodes.push({
          id: `result-persona`,
          type: 'resultNode',
          data: { 
            label: 'Target Persona',
            content: truncateContent(personaResult.content, 100),
            type: 'persona',
            result: personaResult
          },
          position: { x: 300, y: 250 },
          style: { width: 180, height: 160 }
        });
      }
      
      if (uspResult) {
        resultNodes.push({
          id: `result-usp`,
          type: 'resultNode',
          data: { 
            label: 'USP Canvas',
            content: truncateContent(uspResult.content, 100),
            type: 'pain_gains',
            result: uspResult
          },
          position: { x: 500, y: 250 },
          style: { width: 180, height: 160 }
        });
      }
      
      if (funnelResult) {
        resultNodes.push({
          id: `result-funnel`,
          type: 'resultNode',
          data: { 
            label: 'Marketing Funnel',
            content: truncateContent(funnelResult.content, 100),
            type: 'funnel',
            result: funnelResult
          },
          position: { x: 700, y: 250 },
          style: { width: 180, height: 160 }
        });
      }
      
      if (adResult) {
        resultNodes.push({
          id: `result-ads`,
          type: 'resultNode',
          data: { 
            label: 'Ad Campaign',
            content: truncateContent(adResult.content, 100),
            type: 'ads',
            result: adResult
          },
          position: { x: 900, y: 250 },
          style: { width: 180, height: 160 }
        });
      }
      
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

      setNodes([...stageNodes, ...resultNodes]);
      setEdges([...stageEdges, ...resultEdges]);
      setIsLoading(false);
    };

    generateNodesAndEdges();
  }, [strategyId, agentResults, currentStage]);

  // Helper function to truncate content
  const truncateContent = (content: string, maxLength: number): string => {
    if (!content) return '';
    return content.length > maxLength
      ? content.substring(0, maxLength) + '...'
      : content;
  };

  // Helper function to check if a stage is completed
  const isStageCompleted = (stage: StrategyState, currentStage?: StrategyState): boolean => {
    if (!currentStage) return false;
    
    const stages: StrategyState[] = ['briefing', 'persona', 'pain_gains', 'funnel', 'ads'];
    const currentIndex = stages.indexOf(currentStage);
    const stageIndex = stages.indexOf(stage);
    
    return stageIndex < currentIndex;
  };

  // Helper function to get icon for a stage
  const getStageIcon = (stage: StrategyState) => {
    switch (stage) {
      case 'briefing':
        return <FileText size={20} />;
      case 'persona':
        return <User size={20} />;
      case 'pain_gains':
        return <Star size={20} />;
      case 'funnel':
        return <BarChart2 size={20} />;
      case 'ads':
        return <MessageSquare size={20} />;
      default:
        return null;
    }
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
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading strategy visualization...</div>;
  }
  
  // If a USP Canvas node is selected and we have canvas data, render the USP Canvas visualization
  if (selectedNode === 'result-usp' && uspCanvasResult) {
    try {
      // Try to parse the USP Canvas data from the result content
      const uspCanvasData = JSON.parse(uspCanvasResult.content);
      
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">USP Canvas Visualization</h2>
            <Button variant="outline" onClick={() => setSelectedNode(null)}>
              Back to Overview
            </Button>
          </div>
          
          {/* If we have valid USP Canvas data, render the board */}
          {uspCanvasData && (
            <UspCanvasBoard
              canvas={uspCanvasData}
              readOnly={true}
            />
          )}
        </div>
      );
    } catch (error) {
      console.error("Error parsing USP Canvas data:", error);
      // If there's an error parsing the data, just show the regular board
      setSelectedNode(null);
    }
  }

  return (
    <div className="w-full h-[800px] border border-gray-200 rounded-md overflow-hidden">
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
        <MiniMap nodeBorderRadius={8} />
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
    </div>
  );
};

export default StrategyBoard;
