
import React from "react";
import { UspCanvas } from "./types";
import { CustomerProfileSummary, ValueMapSummary, ValuePropositionFit } from "./overview";

interface UspCanvasOverviewProps {
  canvas: UspCanvas;
}

const UspCanvasOverview = ({ canvas }: UspCanvasOverviewProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Canvas Overview & Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomerProfileSummary canvas={canvas} />
        <ValueMapSummary canvas={canvas} />
      </div>
      
      <ValuePropositionFit canvas={canvas} />
    </div>
  );
};

export default UspCanvasOverview;
