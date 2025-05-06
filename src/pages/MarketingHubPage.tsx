
import React from "react";
import NavBar from "@/components/NavBar";
import MarketingAgentHub from "@/components/marketing/MarketingAgentHub";

const MarketingHubPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <NavBar />
      <div className="mt-8">
        <MarketingAgentHub />
      </div>
    </div>
  );
};

export default MarketingHubPage;
