
import React from "react";
import NavBar from "@/components/NavBar";
import { CrmDashboardContent } from "@/components/crm/dashboard";

const CrmDashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container py-6 px-4 md:px-6">
        <CrmDashboardContent />
      </main>
    </div>
  );
};

export default CrmDashboardPage;
