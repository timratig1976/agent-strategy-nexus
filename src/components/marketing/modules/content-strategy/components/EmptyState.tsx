
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const EmptyState = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">No content pillars generated yet.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
