
import React from "react";
import { 
  CanvasItem, 
  CanvasState
} from "../types";
import CanvasTab from "./tabs/CanvasTab";
import VisualizationTab from "./tabs/VisualizationTab";
import AIGeneratorTab from "./tabs/AIGeneratorTab";
import HistoryTab from "./tabs/HistoryTab";
import UspCanvasOverview from "../overview/UspCanvasOverview";
import { mapCanvasToSpecificTypes } from "../utils/canvasMappers";

// Known tab values
export const TABS = {
  CANVAS: 'canvas',
  VISUALIZATION: 'visualization',
  AI_GEN: 'ai_gen',
  HISTORY: 'history',
  OVERVIEW: 'overview'
};

interface CanvasTabsProps {
  canvasId: string;
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
  saveCanvasData: () => Promise<void>;
  activeTab: string;
  briefingContent: string;
  personaContent: string;
}

const CanvasTabs: React.FC<CanvasTabsProps> = ({
  canvasId,
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
  saveCanvasData,
  activeTab,
  briefingContent,
  personaContent
}) => {
  return [
    {
      id: TABS.CANVAS,
      label: "Canvas",
      content: (
        <CanvasTab
          canvasState={canvasState}
          setCanvasState={setCanvasState}
          customerItems={customerItems}
          valueItems={valueItems}
          setCustomerItems={setCustomerItems}
          setValueItems={setValueItems}
          selectedCustomerItems={selectedCustomerItems}
          selectedValueItems={selectedValueItems}
          setSelectedCustomerItems={setSelectedCustomerItems}
          setSelectedValueItems={setSelectedValueItems}
          onSaveCanvas={saveCanvasData}
        />
      )
    },
    {
      id: TABS.VISUALIZATION,
      label: "Visualization",
      content: (
        <VisualizationTab
          customerItems={customerItems}
          valueItems={valueItems}
          selectedCustomerItems={selectedCustomerItems}
          selectedValueItems={selectedValueItems}
          canvasId={canvasId}
        />
      )
    },
    {
      id: TABS.AI_GEN,
      label: "AI Generator",
      content: (
        <AIGeneratorTab
          canvasId={canvasId}
          customerItems={customerItems}
          valueItems={valueItems}
          setCustomerItems={setCustomerItems}
          setValueItems={setValueItems}
          onSaveCanvas={saveCanvasData}
        />
      )
    },
    {
      id: TABS.HISTORY,
      label: "History",
      content: (
        <HistoryTab
          canvasId={canvasId}
          setCustomerItems={setCustomerItems}
          setValueItems={setValueItems}
        />
      )
    },
    {
      id: TABS.OVERVIEW,
      label: "Overview",
      content: (
        <UspCanvasOverview 
          canvas={mapCanvasToSpecificTypes(customerItems, valueItems)}
          briefingContent={briefingContent}
          personaContent={personaContent}
        />
      )
    }
  ];
};

export default CanvasTabs;
