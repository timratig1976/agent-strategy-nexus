
import React from "react";
import NavBar from "@/components/NavBar";

const LoadingStrategy: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    </>
  );
};

export default LoadingStrategy;
