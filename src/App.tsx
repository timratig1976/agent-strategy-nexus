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
import { useAuth } from "@/context/AuthProvider";
import { Navigate } from 'react-router-dom';
import AIPromptManagerPage from "@/pages/AIPromptManagerPage";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Replace with a proper loading indicator
  }

  return user ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Routes>
        <Route index element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/setup-database" element={<SetupDatabase />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/strategy/:strategyId" element={<ProtectedRoute><StrategyDetailsWithNav /></ProtectedRoute>} />
        <Route path="/strategy-details/:strategyId" element={<ProtectedRoute><StrategyDetails /></ProtectedRoute>} />
        <Route path="/create-strategy" element={<ProtectedRoute><CreateStrategy /></ProtectedRoute>} />
        <Route path="/company-summary" element={<ProtectedRoute><CompanySummaryPage /></ProtectedRoute>} />
        <Route path="/marketing-hub" element={<ProtectedRoute><MarketingHubPage /></ProtectedRoute>} />
        <Route path="/module" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />
        <Route path="/ai-prompts" element={<ProtectedRoute><AIPromptManagerPage /></ProtectedRoute>} />
        <Route path="/crm/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/crm/contacts" element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
        <Route path="/crm/contacts/:contactId" element={<ProtectedRoute><ContactDetailsPage /></ProtectedRoute>} />
        <Route path="/crm/deals" element={<ProtectedRoute><DealsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
