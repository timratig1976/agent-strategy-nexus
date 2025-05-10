
import React from 'react';
import { CanvasState, CanvasItem } from '../../types';
import CustomerProfileCanvas from '../../CustomerProfileCanvas';
import ValueMapCanvas from '../../ValueMapCanvas';
import { mapCanvasToSpecificTypes } from '../../utils/canvasMappers';

interface CanvasTabProps {
  canvasState: CanvasState;
  setCanvasState: (state: CanvasState) => void;
  customerItems: CanvasItem[];
  valueItems: CanvasItem[];
  setCustomerItems: (items: CanvasItem[]) => void;
  setValueItems: (items: CanvasItem[]) => void;
  selectedCustomerItems: string[];
  selectedValueItems: string[];
  setSelectedCustomerItems: (items: string[]) => void;
  setSelectedValueItems: (items: string[]) => void;
  onSaveCanvas: () => Promise<void>;
}

const CanvasTab: React.FC<CanvasTabProps> = ({
  canvasState,
  setCanvasState,
  customerItems,
  valueItems,
  setCustomerItems,
  setValueItems,
  selectedCustomerItems,
  selectedValueItems,
  setSelectedCustomerItems,
  setSelectedValueItems,
  onSaveCanvas
}) => {
  // Map customer items to specific types
  const canvas = mapCanvasToSpecificTypes(customerItems, valueItems);
  
  // Handle adding customer jobs
  const handleAddCustomerJob = (content: string, priority: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    setCustomerItems([
      ...customerItems,
      {
        id: `job-${Date.now()}`,
        content,
        rating: priority,
        isAIGenerated
      }
    ]);
  };

  // Handle updating customer jobs
  const handleUpdateCustomerJob = (id: string, content: string, priority: 'low' | 'medium' | 'high') => {
    setCustomerItems(
      customerItems.map(item => 
        item.id === id ? { ...item, content, rating: priority } : item
      )
    );
  };

  // Handle deleting customer jobs
  const handleDeleteCustomerJob = (id: string) => {
    setCustomerItems(customerItems.filter(item => item.id !== id));
  };

  // Similar handlers for other item types
  const handleAddCustomerPain = (content: string, severity: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    setCustomerItems([
      ...customerItems,
      {
        id: `pain-${Date.now()}`,
        content,
        rating: severity,
        isAIGenerated
      }
    ]);
  };

  const handleUpdateCustomerPain = (id: string, content: string, severity: 'low' | 'medium' | 'high') => {
    setCustomerItems(
      customerItems.map(item => 
        item.id === id ? { ...item, content, rating: severity } : item
      )
    );
  };

  const handleDeleteCustomerPain = (id: string) => {
    setCustomerItems(customerItems.filter(item => item.id !== id));
  };

  const handleAddCustomerGain = (content: string, importance: 'low' | 'medium' | 'high', isAIGenerated: boolean = false) => {
    setCustomerItems([
      ...customerItems,
      {
        id: `gain-${Date.now()}`,
        content,
        rating: importance,
        isAIGenerated
      }
    ]);
  };

  const handleUpdateCustomerGain = (id: string, content: string, importance: 'low' | 'medium' | 'high') => {
    setCustomerItems(
      customerItems.map(item => 
        item.id === id ? { ...item, content, rating: importance } : item
      )
    );
  };

  const handleDeleteCustomerGain = (id: string) => {
    setCustomerItems(customerItems.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {canvasState === CanvasState.CUSTOMER_PROFILE ? (
        <CustomerProfileCanvas
          canvas={canvas}
          addCustomerJob={handleAddCustomerJob}
          updateCustomerJob={handleUpdateCustomerJob}
          deleteCustomerJob={handleDeleteCustomerJob}
          addCustomerPain={handleAddCustomerPain}
          updateCustomerPain={handleUpdateCustomerPain}
          deleteCustomerPain={handleDeleteCustomerPain}
          addCustomerGain={handleAddCustomerGain}
          updateCustomerGain={handleUpdateCustomerGain}
          deleteCustomerGain={handleDeleteCustomerGain}
          formPosition="bottom"
        />
      ) : (
        <ValueMapCanvas
          canvas={canvas}
          addProductService={() => {}}
          updateProductService={() => {}}
          deleteProductService={() => {}}
          addPainReliever={() => {}}
          updatePainReliever={() => {}}
          deletePainReliever={() => {}}
          addGainCreator={() => {}}
          updateGainCreator={() => {}}
          deleteGainCreator={() => {}}
          formPosition="bottom"
        />
      )}
    </div>
  );
};

export default CanvasTab;
