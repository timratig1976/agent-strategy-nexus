
import React from "react";
import NavBar from "@/components/NavBar";
import { StrategyForm } from "@/components/strategy-form";

const CreateStrategy = () => {
  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <StrategyForm />
        </div>
      </div>
    </>
  );
};

export default CreateStrategy;
