
import React from "react";
// Header is simplified; global NavBar contains auth controls

interface PageHeaderProps {
  user: any;
  onLogout: () => void;
}

const PageHeader = ({ user }: PageHeaderProps) => {
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 pb-6 border-b">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
          Strategy Hub
        </h1>
      </div>
    </div>
  );
};

export default PageHeader;
