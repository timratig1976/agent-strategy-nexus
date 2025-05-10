
import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import StrategyDetails from "@/pages/StrategyDetails";
import StrategyOverview from "@/pages/StrategyOverview";
import MarketingHubPage from "@/pages/MarketingHubPage";
import CreateStrategy from "./pages/CreateStrategy";
import NotFound from "@/pages/NotFound";
import ModulePage from "@/pages/ModulePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import SetupDatabase from "@/pages/SetupDatabase";
import AIPromptManagerPage from "@/pages/AIPromptManagerPage";
import Settings from "@/pages/Settings";
import CompanySummaryPage from "@/pages/CompanySummaryPage";
import StrategyDetailsWithNav from "@/pages/StrategyDetailsWithNav";
import OrganizationCreate from "@/pages/OrganizationCreate";
import OrganizationSettings from "@/pages/OrganizationSettings";
import { OrganizationProvider } from "@/context/OrganizationProvider";
import { SubscriptionProvider } from "@/context/SubscriptionProvider";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  return (
    <OrganizationProvider>
      <SubscriptionProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/setup-database" element={<SetupDatabase />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create-strategy" element={<CreateStrategy />} />
            <Route path="/strategy/:id" element={<StrategyOverview />} />
            <Route path="/strategy/:id/:state" element={<StrategyDetailsWithNav />} />
            <Route path="/strategy-details/:id" element={<StrategyDetails />} />
            <Route path="/marketing-hub" element={<MarketingHubPage />} />
            <Route path="/module/:moduleId" element={<ModulePage />} />
            <Route path="/ai-prompt-manager" element={<AIPromptManagerPage />} />
            <Route path="/ai-prompt-manager/:moduleId" element={<AIPromptManagerPage />} />
            <Route path="/company-summary" element={<CompanySummaryPage />} />
            
            {/* Organization routes */}
            <Route path="/organizations/new" element={<OrganizationCreate />} />
            <Route path="/organizations/:organizationId/settings" element={<OrganizationSettings />} />
          </Route>

          {/* Not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </SubscriptionProvider>
    </OrganizationProvider>
  );
}
