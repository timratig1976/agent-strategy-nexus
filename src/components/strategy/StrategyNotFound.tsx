
import React from "react";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const StrategyNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Strategy not found</h1>
          <p>The strategy you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="default"
            className="mt-4" 
            onClick={() => navigate('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </>
  );
};

export default StrategyNotFound;
