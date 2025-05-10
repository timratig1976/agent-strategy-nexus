
import React from 'react';
import { CanvasItem } from '../../types';
import UspCanvasBoard from '../../visualization/UspCanvasBoard';

interface VisualizationTabProps {
  customerItems: CanvasItem[];
  valueItems: CanvasItem[];
  selectedCustomerItems: string[];
  selectedValueItems: string[];
  canvasId: string;
}

const VisualizationTab: React.FC<VisualizationTabProps> = ({
  customerItems,
  valueItems,
  canvasId
}) => {
  // Transform the canvas items into the format expected by UspCanvasBoard
  const transformToCanvasFormat = () => {
    // Customer Jobs - items that have "job" in their content or don't specify a negative/positive aspect
    const customerJobs = customerItems
      .filter(item => 
        item.content.toLowerCase().includes('job') || 
        (!item.content.toLowerCase().includes('pain') && !item.content.toLowerCase().includes('gain'))
      )
      .map(item => ({
        id: item.id,
        content: item.content,
        priority: item.rating,
        isAIGenerated: item.isAIGenerated
      }));

    // Customer Pains - items that have "pain" or negative terms in their content
    const customerPains = customerItems
      .filter(item => 
        item.content.toLowerCase().includes('pain') || 
        item.content.toLowerCase().includes('problem') || 
        item.content.toLowerCase().includes('challenge')
      )
      .map(item => ({
        id: item.id,
        content: item.content,
        severity: item.rating,
        isAIGenerated: item.isAIGenerated
      }));

    // Customer Gains - items that have "gain" or positive terms in their content
    const customerGains = customerItems
      .filter(item => 
        item.content.toLowerCase().includes('gain') || 
        item.content.toLowerCase().includes('benefit') || 
        item.content.toLowerCase().includes('desire')
      )
      .map(item => ({
        id: item.id,
        content: item.content,
        importance: item.rating,
        isAIGenerated: item.isAIGenerated
      }));

    // Value map items - split into categories based on content
    const productServices = valueItems
      .filter(item => 
        item.content.toLowerCase().includes('product') || 
        item.content.toLowerCase().includes('service') || 
        item.content.toLowerCase().includes('offer')
      )
      .map(item => ({
        id: item.id,
        content: item.content,
        relatedJobIds: []
      }));

    const painRelievers = valueItems
      .filter(item => 
        item.content.toLowerCase().includes('relieve') || 
        item.content.toLowerCase().includes('solve') || 
        item.content.toLowerCase().includes('fix')
      )
      .map(item => ({
        id: item.id,
        content: item.content,
        relatedPainIds: []
      }));

    const gainCreators = valueItems
      .filter(item => 
        item.content.toLowerCase().includes('create') || 
        item.content.toLowerCase().includes('enhance') || 
        item.content.toLowerCase().includes('provide')
      )
      .map(item => ({
        id: item.id,
        content: item.content,
        relatedGainIds: []
      }));

    // Ensure we have at least some items in each category
    if (customerJobs.length === 0 && customerItems.length > 0) {
      customerItems.slice(0, Math.ceil(customerItems.length / 3)).forEach(item => {
        customerJobs.push({
          id: item.id,
          content: item.content,
          priority: item.rating,
          isAIGenerated: item.isAIGenerated
        });
      });
    }

    if (customerPains.length === 0 && customerItems.length > 0) {
      customerItems.slice(
        Math.ceil(customerItems.length / 3), 
        Math.ceil(customerItems.length * 2 / 3)
      ).forEach(item => {
        customerPains.push({
          id: item.id,
          content: item.content,
          severity: item.rating,
          isAIGenerated: item.isAIGenerated
        });
      });
    }

    if (customerGains.length === 0 && customerItems.length > 0) {
      customerItems.slice(Math.ceil(customerItems.length * 2 / 3)).forEach(item => {
        customerGains.push({
          id: item.id,
          content: item.content,
          importance: item.rating,
          isAIGenerated: item.isAIGenerated
        });
      });
    }

    // Do the same for value items
    if (productServices.length === 0 && valueItems.length > 0) {
      valueItems.slice(0, Math.ceil(valueItems.length / 3)).forEach(item => {
        productServices.push({
          id: item.id,
          content: item.content,
          relatedJobIds: []
        });
      });
    }

    if (painRelievers.length === 0 && valueItems.length > 0) {
      valueItems.slice(
        Math.ceil(valueItems.length / 3), 
        Math.ceil(valueItems.length * 2 / 3)
      ).forEach(item => {
        painRelievers.push({
          id: item.id,
          content: item.content,
          relatedPainIds: []
        });
      });
    }

    if (gainCreators.length === 0 && valueItems.length > 0) {
      valueItems.slice(Math.ceil(valueItems.length * 2 / 3)).forEach(item => {
        gainCreators.push({
          id: item.id,
          content: item.content,
          relatedGainIds: []
        });
      });
    }

    return {
      customerJobs,
      customerPains,
      customerGains,
      productServices,
      painRelievers,
      gainCreators
    };
  };

  const canvasData = transformToCanvasFormat();

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Interactive visualization of your USP Canvas. Click and drag nodes to reorganize.
      </p>
      
      <UspCanvasBoard
        canvas={canvasData}
        readOnly={true}
      />
    </div>
  );
};

export default VisualizationTab;
