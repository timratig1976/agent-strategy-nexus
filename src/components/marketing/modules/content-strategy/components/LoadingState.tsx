
import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-muted-foreground">
          Generating your content pillar strategy...
        </p>
      </div>
    </Card>
  );
};

export default LoadingState;
