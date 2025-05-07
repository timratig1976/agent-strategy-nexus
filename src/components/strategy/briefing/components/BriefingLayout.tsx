
import React, { ReactNode } from "react";

interface BriefingLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

const BriefingLayout: React.FC<BriefingLayoutProps> = ({
  leftContent,
  rightContent
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>{leftContent}</div>
      <div>{rightContent}</div>
    </div>
  );
};

export default BriefingLayout;
