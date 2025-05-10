
import React from "react";
import { UspCanvas } from "../../types";
import UspCanvasBoard from "../../visualization/UspCanvasBoard";

interface VisualizationTabProps {
  canvas: UspCanvas;
  onUpdateCanvas: (updatedCanvas: UspCanvas) => void;
  onAddCustomerJob: (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdateCustomerJob: (id: string, content: string, priority: 'low' | 'medium' | 'high') => void;
  onDeleteCustomerJob: (id: string) => void;
  onAddCustomerPain: (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdateCustomerPain: (id: string, content: string, severity: 'low' | 'medium' | 'high') => void;
  onDeleteCustomerPain: (id: string) => void;
  onAddCustomerGain: (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated?: boolean) => void;
  onUpdateCustomerGain: (id: string, content: string, importance: 'low' | 'medium' | 'high') => void;
  onDeleteCustomerGain: (id: string) => void;
  onAddProductService: (content: string, relatedJobIds: string[]) => void;
  onUpdateProductService: (id: string, content: string, relatedJobIds: string[]) => void;
  onDeleteProductService: (id: string) => void;
  onAddPainReliever: (content: string, relatedPainIds: string[]) => void;
  onUpdatePainReliever: (id: string, content: string, relatedPainIds: string[]) => void;
  onDeletePainReliever: (id: string) => void;
  onAddGainCreator: (content: string, relatedGainIds: string[]) => void;
  onUpdateGainCreator: (id: string, content: string, relatedGainIds: string[]) => void;
  onDeleteGainCreator: (id: string) => void;
}

const VisualizationTab: React.FC<VisualizationTabProps> = ({
  canvas,
  onUpdateCanvas,
  onAddCustomerJob,
  onUpdateCustomerJob,
  onDeleteCustomerJob,
  onAddCustomerPain,
  onUpdateCustomerPain,
  onDeleteCustomerPain,
  onAddCustomerGain,
  onUpdateCustomerGain,
  onDeleteCustomerGain,
  onAddProductService,
  onUpdateProductService,
  onDeleteProductService,
  onAddPainReliever,
  onUpdatePainReliever,
  onDeletePainReliever,
  onAddGainCreator,
  onUpdateGainCreator,
  onDeleteGainCreator
}) => {
  // Handler for adding new items
  const handleAddItem = (type: string, data: any) => {
    switch (type) {
      case 'customerJobs':
        onAddCustomerJob(data.content, data.priority, false);
        break;
      case 'customerPains':
        onAddCustomerPain(data.content, data.severity, false);
        break;
      case 'customerGains':
        onAddCustomerGain(data.content, data.importance, false);
        break;
      case 'productServices':
        onAddProductService(data.content, data.relatedJobIds);
        break;
      case 'painRelievers':
        onAddPainReliever(data.content, data.relatedPainIds);
        break;
      case 'gainCreators':
        onAddGainCreator(data.content, data.relatedGainIds);
        break;
    }
  };

  // Handler for updating items
  const handleUpdateItem = (type: string, id: string, data: any) => {
    switch (type) {
      case 'customerJobs':
        onUpdateCustomerJob(id, data.content, data.priority);
        break;
      case 'customerPains':
        onUpdateCustomerPain(id, data.content, data.severity);
        break;
      case 'customerGains':
        onUpdateCustomerGain(id, data.content, data.importance);
        break;
      case 'productServices':
        onUpdateProductService(id, data.content, data.relatedJobIds);
        break;
      case 'painRelievers':
        onUpdatePainReliever(id, data.content, data.relatedPainIds);
        break;
      case 'gainCreators':
        onUpdateGainCreator(id, data.content, data.relatedGainIds);
        break;
    }
  };

  // Handler for deleting items
  const handleDeleteItem = (type: string, id: string) => {
    switch (type) {
      case 'customerJobs':
        onDeleteCustomerJob(id);
        break;
      case 'customerPains':
        onDeleteCustomerPain(id);
        break;
      case 'customerGains':
        onDeleteCustomerGain(id);
        break;
      case 'productServices':
        onDeleteProductService(id);
        break;
      case 'painRelievers':
        onDeletePainReliever(id);
        break;
      case 'gainCreators':
        onDeleteGainCreator(id);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <UspCanvasBoard
        canvas={canvas}
        onSave={onUpdateCanvas}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
      />
    </div>
  );
};

export default VisualizationTab;
