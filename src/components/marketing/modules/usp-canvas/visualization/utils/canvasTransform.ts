
import { Node, Edge } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { 
  UspCanvas, 
  CustomerJob, 
  CustomerPain, 
  CustomerGain, 
  ProductService, 
  PainReliever, 
  GainCreator 
} from '../../types';

// Node positions
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const PROFILE_SECTION_X = CANVAS_WIDTH * 0.7;
const VALUE_SECTION_X = CANVAS_WIDTH * 0.3;
const SECTION_Y_START = 50;
const ITEM_SPACING = 150;

/**
 * Transform the USP Canvas data into React Flow nodes and edges
 */
export const transformCanvasToNodesAndEdges = (canvas: UspCanvas): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Create section nodes
  nodes.push(
    {
      id: 'section-customer-profile',
      type: 'canvasSection',
      data: { 
        label: 'Customer Profile',
        description: 'What customers are trying to get done, their pains, and their desired gains'
      },
      position: { x: PROFILE_SECTION_X - 200, y: SECTION_Y_START },
      style: { width: 400, height: 50, backgroundColor: 'rgba(219, 234, 254, 0.6)' } // light blue background
    },
    {
      id: 'section-value-map',
      type: 'canvasSection',
      data: { 
        label: 'Value Map',
        description: 'Your products/services and how they relieve pains and create gains'
      },
      position: { x: VALUE_SECTION_X - 200, y: SECTION_Y_START },
      style: { width: 400, height: 50, backgroundColor: 'rgba(254, 226, 226, 0.6)' } // light red background
    },
    {
      id: 'section-jobs',
      type: 'canvasSection',
      data: { label: 'Customer Jobs' },
      position: { x: PROFILE_SECTION_X - 150, y: SECTION_Y_START + 80 },
      style: { width: 300, height: 40, backgroundColor: 'rgba(191, 219, 254, 0.4)' } // light blue background
    },
    {
      id: 'section-pains',
      type: 'canvasSection',
      data: { label: 'Customer Pains' },
      position: { x: PROFILE_SECTION_X - 150, y: SECTION_Y_START + 280 },
      style: { width: 300, height: 40, backgroundColor: 'rgba(252, 165, 165, 0.4)' } // light red background
    },
    {
      id: 'section-gains',
      type: 'canvasSection',
      data: { label: 'Customer Gains' },
      position: { x: PROFILE_SECTION_X - 150, y: SECTION_Y_START + 480 },
      style: { width: 300, height: 40, backgroundColor: 'rgba(187, 247, 208, 0.4)' } // light green background
    },
    {
      id: 'section-products',
      type: 'canvasSection',
      data: { label: 'Products & Services' },
      position: { x: VALUE_SECTION_X - 150, y: SECTION_Y_START + 80 },
      style: { width: 300, height: 40, backgroundColor: 'rgba(199, 210, 254, 0.4)' } // light purple background
    },
    {
      id: 'section-relievers',
      type: 'canvasSection',
      data: { label: 'Pain Relievers' },
      position: { x: VALUE_SECTION_X - 150, y: SECTION_Y_START + 280 },
      style: { width: 300, height: 40, backgroundColor: 'rgba(254, 215, 170, 0.4)' } // light orange background
    },
    {
      id: 'section-creators',
      type: 'canvasSection',
      data: { label: 'Gain Creators' },
      position: { x: VALUE_SECTION_X - 150, y: SECTION_Y_START + 480 },
      style: { width: 300, height: 40, backgroundColor: 'rgba(167, 243, 208, 0.4)' } // light green background
    }
  );

  // Customer Jobs
  canvas.customerJobs.forEach((job, index) => {
    const nodeId = `customerJob-${job.id}`;
    nodes.push({
      id: nodeId,
      type: 'customerJob',
      data: { 
        ...job,
        onUpdate: () => {}, // This will be replaced by the actual handler in the component
        onDelete: () => {}
      },
      position: { 
        x: PROFILE_SECTION_X - 80 + ((index % 2) * 160), 
        y: SECTION_Y_START + 140 + Math.floor(index / 2) * ITEM_SPACING / 2
      },
      style: {
        width: 150,
        height: 100,
        backgroundColor: getPriorityColor(job.priority)
      }
    });
  });

  // Customer Pains
  canvas.customerPains.forEach((pain, index) => {
    const nodeId = `customerPain-${pain.id}`;
    nodes.push({
      id: nodeId,
      type: 'customerPain',
      data: { 
        ...pain,
        onUpdate: () => {},
        onDelete: () => {}
      },
      position: { 
        x: PROFILE_SECTION_X - 80 + ((index % 2) * 160), 
        y: SECTION_Y_START + 340 + Math.floor(index / 2) * ITEM_SPACING / 2 
      },
      style: {
        width: 150,
        height: 100,
        backgroundColor: getSeverityColor(pain.severity)
      }
    });
  });

  // Customer Gains
  canvas.customerGains.forEach((gain, index) => {
    const nodeId = `customerGain-${gain.id}`;
    nodes.push({
      id: nodeId,
      type: 'customerGain',
      data: { 
        ...gain,
        onUpdate: () => {},
        onDelete: () => {}
      },
      position: { 
        x: PROFILE_SECTION_X - 80 + ((index % 2) * 160), 
        y: SECTION_Y_START + 540 + Math.floor(index / 2) * ITEM_SPACING / 2 
      },
      style: {
        width: 150,
        height: 100,
        backgroundColor: getImportanceColor(gain.importance)
      }
    });
  });

  // Product Services
  canvas.productServices.forEach((service, index) => {
    const nodeId = `productService-${service.id}`;
    nodes.push({
      id: nodeId,
      type: 'productService',
      data: { 
        ...service,
        onUpdate: () => {},
        onDelete: () => {}
      },
      position: { 
        x: VALUE_SECTION_X - 80 + ((index % 2) * 160), 
        y: SECTION_Y_START + 140 + Math.floor(index / 2) * ITEM_SPACING / 2 
      },
      style: {
        width: 150,
        height: 100,
        backgroundColor: 'rgba(199, 210, 254, 0.8)' // purple
      }
    });
    
    // Create edges to related jobs
    service.relatedJobIds.forEach(jobId => {
      edges.push({
        id: `e-${service.id}-${jobId}`,
        source: nodeId,
        target: `customerJob-${jobId}`,
        type: 'relationship',
        animated: true,
        style: { stroke: '#6366f1' } // purple
      });
    });
  });

  // Pain Relievers
  canvas.painRelievers.forEach((reliever, index) => {
    const nodeId = `painReliever-${reliever.id}`;
    nodes.push({
      id: nodeId,
      type: 'painReliever',
      data: { 
        ...reliever,
        onUpdate: () => {},
        onDelete: () => {}
      },
      position: { 
        x: VALUE_SECTION_X - 80 + ((index % 2) * 160), 
        y: SECTION_Y_START + 340 + Math.floor(index / 2) * ITEM_SPACING / 2 
      },
      style: {
        width: 150,
        height: 100,
        backgroundColor: 'rgba(254, 215, 170, 0.8)' // light orange
      }
    });
    
    // Create edges to related pains
    reliever.relatedPainIds.forEach(painId => {
      edges.push({
        id: `e-${reliever.id}-${painId}`,
        source: nodeId,
        target: `customerPain-${painId}`,
        type: 'relationship',
        animated: true,
        style: { stroke: '#f97316' } // orange
      });
    });
  });

  // Gain Creators
  canvas.gainCreators.forEach((creator, index) => {
    const nodeId = `gainCreator-${creator.id}`;
    nodes.push({
      id: nodeId,
      type: 'gainCreator',
      data: { 
        ...creator,
        onUpdate: () => {},
        onDelete: () => {}
      },
      position: { 
        x: VALUE_SECTION_X - 80 + ((index % 2) * 160), 
        y: SECTION_Y_START + 540 + Math.floor(index / 2) * ITEM_SPACING / 2 
      },
      style: {
        width: 150,
        height: 100,
        backgroundColor: 'rgba(167, 243, 208, 0.8)' // light green
      }
    });
    
    // Create edges to related gains
    creator.relatedGainIds.forEach(gainId => {
      edges.push({
        id: `e-${creator.id}-${gainId}`,
        source: nodeId,
        target: `customerGain-${gainId}`,
        type: 'relationship',
        animated: true,
        style: { stroke: '#10b981' } // green
      });
    });
  });

  return { nodes, edges };
};

/**
 * Create a new item node of the specified type
 */
export const createNewItemNode = (type: string): { node: Node, item: any } => {
  const id = uuidv4();
  let position = { x: 0, y: 0 };
  let nodeType = '';
  let data: any = { id };
  let style = {};
  let item: any = { id };
  
  switch (type) {
    case 'customerJobs':
      nodeType = 'customerJob';
      position = { x: PROFILE_SECTION_X, y: SECTION_Y_START + 140 };
      data = { 
        id, 
        content: 'New customer job', 
        priority: 'medium',
        onUpdate: () => {},
        onDelete: () => {}
      };
      style = { width: 150, height: 100, backgroundColor: getPriorityColor('medium') };
      item = { id, content: 'New customer job', priority: 'medium' };
      break;
      
    case 'customerPains':
      nodeType = 'customerPain';
      position = { x: PROFILE_SECTION_X, y: SECTION_Y_START + 340 };
      data = { 
        id, 
        content: 'New customer pain', 
        severity: 'medium',
        onUpdate: () => {},
        onDelete: () => {}
      };
      style = { width: 150, height: 100, backgroundColor: getSeverityColor('medium') };
      item = { id, content: 'New customer pain', severity: 'medium' };
      break;
      
    case 'customerGains':
      nodeType = 'customerGain';
      position = { x: PROFILE_SECTION_X, y: SECTION_Y_START + 540 };
      data = { 
        id, 
        content: 'New customer gain', 
        importance: 'medium',
        onUpdate: () => {},
        onDelete: () => {}
      };
      style = { width: 150, height: 100, backgroundColor: getImportanceColor('medium') };
      item = { id, content: 'New customer gain', importance: 'medium' };
      break;
      
    case 'productServices':
      nodeType = 'productService';
      position = { x: VALUE_SECTION_X, y: SECTION_Y_START + 140 };
      data = { 
        id, 
        content: 'New product/service', 
        relatedJobIds: [],
        onUpdate: () => {},
        onDelete: () => {}
      };
      style = { width: 150, height: 100, backgroundColor: 'rgba(199, 210, 254, 0.8)' };
      item = { id, content: 'New product/service', relatedJobIds: [] };
      break;
      
    case 'painRelievers':
      nodeType = 'painReliever';
      position = { x: VALUE_SECTION_X, y: SECTION_Y_START + 340 };
      data = { 
        id, 
        content: 'New pain reliever', 
        relatedPainIds: [],
        onUpdate: () => {},
        onDelete: () => {}
      };
      style = { width: 150, height: 100, backgroundColor: 'rgba(254, 215, 170, 0.8)' };
      item = { id, content: 'New pain reliever', relatedPainIds: [] };
      break;
      
    case 'gainCreators':
      nodeType = 'gainCreator';
      position = { x: VALUE_SECTION_X, y: SECTION_Y_START + 540 };
      data = { 
        id, 
        content: 'New gain creator', 
        relatedGainIds: [],
        onUpdate: () => {},
        onDelete: () => {}
      };
      style = { width: 150, height: 100, backgroundColor: 'rgba(167, 243, 208, 0.8)' };
      item = { id, content: 'New gain creator', relatedGainIds: [] };
      break;
  }
  
  return {
    node: {
      id: `${nodeType}-${id}`,
      type: nodeType,
      data,
      position,
      style
    },
    item
  };
};

// Helper functions to get colors based on priority, severity, and importance
const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high':
      return 'rgba(191, 219, 254, 0.9)'; // darker blue for high priority
    case 'medium':
      return 'rgba(191, 219, 254, 0.7)'; // medium blue
    case 'low':
      return 'rgba(191, 219, 254, 0.5)'; // light blue
    default:
      return 'rgba(191, 219, 254, 0.7)';
  }
};

const getSeverityColor = (severity: 'low' | 'medium' | 'high'): string => {
  switch (severity) {
    case 'high':
      return 'rgba(252, 165, 165, 0.9)'; // darker red for high severity
    case 'medium':
      return 'rgba(252, 165, 165, 0.7)'; // medium red
    case 'low':
      return 'rgba(252, 165, 165, 0.5)'; // light red
    default:
      return 'rgba(252, 165, 165, 0.7)';
  }
};

const getImportanceColor = (importance: 'low' | 'medium' | 'high'): string => {
  switch (importance) {
    case 'high':
      return 'rgba(187, 247, 208, 0.9)'; // darker green for high importance
    case 'medium':
      return 'rgba(187, 247, 208, 0.7)'; // medium green
    case 'low':
      return 'rgba(187, 247, 208, 0.5)'; // light green
    default:
      return 'rgba(187, 247, 208, 0.7)';
  }
};
