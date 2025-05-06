
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import SetupDatabase from '@/pages/SetupDatabase';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import StrategyDetailsWithNav from '@/pages/StrategyDetailsWithNav';
import StrategyDetails from '@/pages/StrategyDetails';
import CreateStrategy from '@/pages/CreateStrategy';
import CompanySummaryPage from '@/pages/CompanySummaryPage';
import MarketingHubPage from '@/pages/MarketingHubPage';
import ModulePage from '@/pages/ModulePage';
import DashboardPage from "@/pages/crm/DashboardPage";
import ContactsPage from "@/pages/crm/ContactsPage";
import ContactDetailsPage from "@/pages/crm/ContactDetailsPage";
import DealsPage from "@/pages/crm/DealsPage";
import NotFound from "@/pages/NotFound";
import AIPromptManagerPage from "@/pages/AIPromptManagerPage";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * App component with improved routing and security
 * Uses AuthProvider for authentication context and ProtectedRoute for route guarding
 */
function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Routes>
        <Route index element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Public routes */}
        <Route path="/setup-database" element={<SetupDatabase />} />
        
        {/* Protected routes using the enhanced ProtectedRoute component */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/strategy/:strategyId" element={<StrategyDetailsWithNav />} />
          <Route path="/strategy-details/:strategyId" element={<StrategyDetails />} />
          <Route path="/create-strategy" element={<CreateStrategy />} />
          <Route path="/company-summary" element={<CompanySummaryPage />} />
          <Route path="/marketing-hub" element={<MarketingHubPage />} />
          <Route path="/module" element={<ModulePage />} />
          <Route path="/ai-prompts" element={<AIPromptManagerPage />} />
          <Route path="/crm/dashboard" element={<DashboardPage />} />
          <Route path="/crm/contacts" element={<ContactsPage />} />
          <Route path="/crm/contacts/:contactId" element={<ContactDetailsPage />} />
          <Route path="/crm/deals" element={<DealsPage />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
