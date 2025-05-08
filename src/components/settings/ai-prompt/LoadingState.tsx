
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const LoadingState: React.FC = () => {
  return (
    <CardContent className="flex justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </CardContent>
  );
};
