
import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
  EdgeTypes,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { UspCanvas } from '../types';
import { 
  transformCanvasToNodesAndEdges, 
  createNewItemNode 
} from './utils/canvasTransform';
import { 
  CustomerJobNode, 
  CustomerPainNode, 
  CustomerGainNode,
  ProductServiceNode, 
  PainRelieverNode, 
  GainCreatorNode,
  CanvasSectionNode
} from './nodes';
import { RelationshipEdge } from './edges';
import { Button } from '@/components/ui/button';
import { PlusCircle, Save, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface UspCanvasVisualizationProps {
  canvas: UspCanvas;
  readOnly?: boolean;
  onSave?: (updatedCanvas: UspCanvas) => void;
  onAddItem?: (type: string, data: any) => void;
  onUpdateItem?: (type: string, id: string, data: any) => void;
  onDeleteItem?: (type: string, id: string) => void;
}

const UspCanvasBoard: React.FC<UspCanvasVisualizationProps> = ({
  canvas,
  readOnly = false,
  onSave,
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) => {
  // Define node types
  const nodeTypes: NodeTypes = {
    customerJob: CustomerJobNode,
    customerPain: CustomerPainNode,
    customerGain: CustomerGainNode,
    productService: ProductServiceNode,
    painReliever: PainRelieverNode,
    gainCreator: GainCreatorNode,
    canvasSection: CanvasSectionNode
  };

  // Define edge types
  const edgeTypes: EdgeTypes = {
    relationship: RelationshipEdge
  };

  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('view');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayMode, setDisplayMode] = useState<'all' | 'profile' | 'value'>('all');
  
  // Transform canvas data to nodes and edges
  useEffect(() => {
    const { nodes: initialNodes, edges: initialEdges } = transformCanvasToNodesAndEdges(canvas);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [canvas, setNodes, setEdges]);

  // Handle connection between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        type: 'relationship',
        animated: true,
        style: { stroke: '#5551ff' }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      
      // Here we could update the underlying relationship data
      if (onUpdateItem) {
        const sourceNode = nodes.find(n => n.id === connection.source);
        const targetNode = nodes.find(n => n.id === connection.target);
        if (sourceNode && targetNode) {
          // For example, if connecting a Pain Reliever to a Customer Pain
          if (sourceNode.type === 'painReliever' && targetNode.type === 'customerPain') {
            onUpdateItem('painRelievers', sourceNode.id.split('-')[1], {
              relatedPainIds: [...sourceNode.data.relatedPainIds, targetNode.id.split('-')[1]]
            });
          }
        }
      }
    },
    [nodes, setEdges, onUpdateItem]
  );

  // Handle node changes (e.g., when a node is moved)
  const handleNodeUpdate = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );

    // Extract the actual ID from the node ID (removing the prefix)
    const actualId = nodeId.split('-')[1];
    
    // Update the underlying data
    if (onUpdateItem) {
      const nodeType = nodeId.split('-')[0];
      switch (nodeType) {
        case 'customerJob':
          onUpdateItem('customerJobs', actualId, newData);
          break;
        case 'customerPain':
          onUpdateItem('customerPains', actualId, newData);
          break;
        case 'customerGain':
          onUpdateItem('customerGains', actualId, newData);
          break;
        case 'productService':
          onUpdateItem('productServices', actualId, newData);
          break;
        case 'painReliever':
          onUpdateItem('painRelievers', actualId, newData);
          break;
        case 'gainCreator':
          onUpdateItem('gainCreators', actualId, newData);
          break;
      }
    }
  }, [setNodes, onUpdateItem]);

  // Handle adding a new node
  const handleAddNode = (type: string) => {
    if (!onAddItem) return;
    
    // Create a new node based on the type
    const newNodeData = createNewItemNode(type);
    
    // Add the new node to the canvas first
    setNodes((nds) => [...nds, newNodeData.node]);
    
    // Then call the onAddItem callback
    onAddItem(type, newNodeData.item);
    
    toast.success(`Added new ${type} item`);
  };

  // Handle delete node
  const handleDeleteNode = (nodeId: string) => {
    if (!onDeleteItem) return;
    
    // Extract the actual ID and type from the node ID
    const [nodeType, actualId] = nodeId.split('-');
    
    // Remove the node from the canvas
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    
    // Remove any edges connected to this node
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
    
    // Call the onDeleteItem callback
    switch (nodeType) {
      case 'customerJob':
        onDeleteItem('customerJobs', actualId);
        break;
      case 'customerPain':
        onDeleteItem('customerPains', actualId);
        break;
      case 'customerGain':
        onDeleteItem('customerGains', actualId);
        break;
      case 'productService':
        onDeleteItem('productServices', actualId);
        break;
      case 'painReliever':
        onDeleteItem('painRelievers', actualId);
        break;
      case 'gainCreator':
        onDeleteItem('gainCreators', actualId);
        break;
    }
    
    toast.success(`Deleted ${nodeType} item`);
  };

  // Handle save
  const handleSave = () => {
    if (onSave) {
      // Transform nodes and edges back to canvas format
      // This is a simplification - you'd need to implement this function
      const updatedCanvas = {
        ...canvas
        // Update with changes from nodes and edges
      };
      onSave(updatedCanvas);
      toast.success("Canvas saved successfully");
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    const element = document.getElementById('usp-canvas-board');
    if (!element) return;
    
    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };

  // Filter nodes based on display mode
  const filteredNodes = nodes.filter(node => {
    if (displayMode === 'all') return true;
    if (displayMode === 'profile') {
      return ['customerJob', 'customerPain', 'customerGain', 'canvasSection'].includes(node.type || '');
    }
    if (displayMode === 'value') {
      return ['productService', 'painReliever', 'gainCreator', 'canvasSection'].includes(node.type || '');
    }
    return true;
  });
  
  // Filter edges based on display mode and visible nodes
  const filteredEdges = edges.filter(edge => {
    const sourceNode = filteredNodes.find(n => n.id === edge.source);
    const targetNode = filteredNodes.find(n => n.id === edge.target);
    return sourceNode && targetNode;
  });

  return (
    <div 
      id="usp-canvas-board"
      className="w-full h-[700px] border border-gray-200 rounded-md overflow-hidden"
    >
      <ReactFlow
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-slate-50"
      >
        <Panel position="top-left" className="bg-white p-2 rounded-md shadow-sm">
          <Tabs value={displayMode} onValueChange={(value) => setDisplayMode(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="profile">Customer Profile</TabsTrigger>
              <TabsTrigger value="value">Value Map</TabsTrigger>
            </TabsList>
          </Tabs>
        </Panel>

        <Panel position="top-right" className="flex gap-2">
          {!readOnly && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setViewMode(viewMode === 'edit' ? 'view' : 'edit')}
                className="bg-white"
              >
                {viewMode === 'edit' ? 'View Mode' : 'Edit Mode'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSave}
                className="bg-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen}
            className="bg-white"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </Panel>
        
        {viewMode === 'edit' && !readOnly && (
          <Panel position="bottom-left" className="bg-white p-2 rounded-md shadow-sm">
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium">Add New Item:</h3>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddNode('customerJobs')}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Job
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddNode('customerPains')}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Pain
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddNode('customerGains')}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Gain
                </Button>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddNode('productServices')}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Product
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddNode('painRelievers')}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Reliever
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddNode('gainCreators')}
                >
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Creator
                </Button>
              </div>
            </div>
          </Panel>
        )}

        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
          nodeColor={(node) => {
            switch (node.type) {
              case 'customerJob':
                return '#3b82f6';
              case 'customerPain':
                return '#ef4444';
              case 'customerGain':
                return '#22c55e';
              case 'productService':
                return '#6366f1';
              case 'painReliever':
                return '#f97316';
              case 'gainCreator':
                return '#10b981';
              default:
                return '#94a3b8';
            }
          }}
        />
        <Controls />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
};

export default UspCanvasBoard;
