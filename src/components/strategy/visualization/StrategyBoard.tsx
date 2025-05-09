
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
import { Download } from "lucide-react";

// Custom node components will be imported here
import { useNavigate } from 'react-router-dom';

interface StrategyBoardProps {
  strategyId: string;
  agentResults?: any[];
}

const StrategyBoard: React.FC<StrategyBoardProps> = ({
  strategyId,
  agentResults = []
}) => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set up initial nodes and edges based on strategy data
  useEffect(() => {
    if (!strategyId) return;

    const generateNodesAndEdges = async () => {
      setIsLoading(true);
      
      // Example: Simple nodes for visualization
      // In a real implementation, these would be generated from actual strategy data
      const initialNodes: Node[] = [
        {
          id: 'briefing',
          type: 'default',
          data: { label: 'Strategy Briefing' },
          position: { x: 250, y: 100 },
          style: { background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '10px', width: 200 }
        },
        {
          id: 'persona',
          type: 'default',
          data: { label: 'Target Persona' },
          position: { x: 250, y: 250 },
          style: { background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px', width: 200 }
        },
        {
          id: 'usp-canvas',
          type: 'default',
          data: { label: 'USP Canvas' },
          position: { x: 500, y: 175 },
          style: { background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: '8px', padding: '10px', width: 200 }
        },
        {
          id: 'funnel',
          type: 'default',
          data: { label: 'Marketing Funnel' },
          position: { x: 750, y: 100 },
          style: { background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '8px', padding: '10px', width: 200 }
        },
        {
          id: 'ads',
          type: 'default',
          data: { label: 'Ad Campaign' },
          position: { x: 750, y: 250 },
          style: { background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '10px', width: 200 }
        },
      ];
      
      const initialEdges: Edge[] = [
        { id: 'e1-2', source: 'briefing', target: 'persona', animated: true },
        { id: 'e1-3', source: 'persona', target: 'usp-canvas', animated: true },
        { id: 'e3-4', source: 'usp-canvas', target: 'funnel', animated: true },
        { id: 'e4-5', source: 'usp-canvas', target: 'ads', animated: true },
      ];

      setNodes(initialNodes);
      setEdges(initialEdges);
      setIsLoading(false);
    };

    generateNodesAndEdges();
  }, [strategyId, agentResults]);

  const handleExport = () => {
    // This will be implemented to export the board as PNG or PDF
    console.log("Export functionality to be implemented");
    // In a full implementation, we would use html-to-image or similar libraries
    // to capture the board content
    alert("Export feature will download the board as an image");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading strategy visualization...</div>;
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
