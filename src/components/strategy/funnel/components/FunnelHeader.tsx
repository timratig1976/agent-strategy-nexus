
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelHeaderProps {
  title?: string;
}

const FunnelHeader: React.FC<FunnelHeaderProps> = ({ title = "Funnel Strategy" }) => {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
  );
};

export default FunnelHeader;
