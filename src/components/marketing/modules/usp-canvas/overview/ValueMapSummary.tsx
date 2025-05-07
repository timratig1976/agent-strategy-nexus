
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UspCanvas } from "../types";

interface ValueMapSummaryProps {
  canvas: UspCanvas;
}

const ValueMapSummary: React.FC<ValueMapSummaryProps> = ({ canvas }) => {
  // Calculate how many product services have related jobs
  const productsWithRelatedJobs = canvas.productServices.filter(
    product => product.relatedJobIds && product.relatedJobIds.length > 0
  );
  
  // Calculate how many pain relievers have related pains
  const relieversWithRelatedPains = canvas.painRelievers.filter(
    reliever => reliever.relatedPainIds && reliever.relatedPainIds.length > 0
  );
  
  // Calculate how many gain creators have related gains
  const creatorsWithRelatedGains = canvas.gainCreators.filter(
    creator => creator.relatedGainIds && creator.relatedGainIds.length > 0
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-4">Value Map</h3>
        
        <div className="space-y-6">
          {/* Products & Services Summary */}
          <div>
            <h4 className="text-sm font-medium text-indigo-700 mb-2">Products & Services</h4>
            <div className="space-y-2">
              {canvas.productServices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products or services defined</p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Total:</span>
                    <span className="text-sm font-medium">{canvas.productServices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Connected to jobs:</span>
                    <span className="text-sm font-medium">{productsWithRelatedJobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Unconnected:</span>
                    <span className="text-sm font-medium">
                      {canvas.productServices.length - productsWithRelatedJobs.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Pain Relievers Summary */}
          <div>
            <h4 className="text-sm font-medium text-rose-700 mb-2">Pain Relievers</h4>
            <div className="space-y-2">
              {canvas.painRelievers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pain relievers defined</p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Total:</span>
                    <span className="text-sm font-medium">{canvas.painRelievers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Connected to pains:</span>
                    <span className="text-sm font-medium">{relieversWithRelatedPains.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Unconnected:</span>
                    <span className="text-sm font-medium">
                      {canvas.painRelievers.length - relieversWithRelatedPains.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Gain Creators Summary */}
          <div>
            <h4 className="text-sm font-medium text-emerald-700 mb-2">Gain Creators</h4>
            <div className="space-y-2">
              {canvas.gainCreators.length === 0 ? (
                <p className="text-sm text-muted-foreground">No gain creators defined</p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Total:</span>
                    <span className="text-sm font-medium">{canvas.gainCreators.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Connected to gains:</span>
                    <span className="text-sm font-medium">{creatorsWithRelatedGains.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Unconnected:</span>
                    <span className="text-sm font-medium">
                      {canvas.gainCreators.length - creatorsWithRelatedGains.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValueMapSummary;
