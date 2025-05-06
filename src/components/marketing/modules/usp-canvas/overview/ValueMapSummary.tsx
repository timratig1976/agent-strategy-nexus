
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UspCanvas } from "../types";

interface ValueMapSummaryProps {
  canvas: UspCanvas;
}

const ValueMapSummary = ({ canvas }: ValueMapSummaryProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Value Map</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Products & Services</span>
              <span className="font-medium">{canvas.productServices.length}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pain Relievers</span>
              <span className="font-medium">{canvas.painRelievers.length}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Gain Creators</span>
              <span className="font-medium">{canvas.gainCreators.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValueMapSummary;
