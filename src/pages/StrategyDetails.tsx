
import React from "react";
import NavBar from "@/components/NavBar";

// This is a read-only file, so we need to create a wrapper component
const StrategyDetailsWithNav = () => {
  // Import the original component dynamically to avoid modifying it directly
  const StrategyDetails = require("./StrategyDetails").default;
  
  return (
    <>
      <NavBar />
      <StrategyDetails />
    </>
  );
};

export default StrategyDetailsWithNav;
