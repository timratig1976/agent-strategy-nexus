
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateStrategy from "./pages/CreateStrategy";
import StrategyDetailsWithNav from "./pages/StrategyDetailsWithNav";
import SetupDatabase from "./pages/SetupDatabase";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import CompanySummaryPage from "./pages/CompanySummaryPage";
import ContactsPage from "./pages/crm/ContactsPage";
import ContactDetailsPage from "./pages/crm/ContactDetailsPage";
import DealsPage from "./pages/crm/DealsPage";
import CrmDashboardPage from "./pages/crm/DashboardPage";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "@/components/ui/sonner";

const AppContent = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("Successfully logged out");
  };

  return (
    <div className="relative">
      {user && (
        <div className="fixed top-3 right-4 z-40">
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      )}
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/setup-database" element={<SetupDatabase />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Marketing Strategy Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-strategy" element={<CreateStrategy />} />
          <Route path="/strategy/:id" element={<StrategyDetailsWithNav />} />
          <Route path="/company-summary" element={<CompanySummaryPage />} />
          
          {/* CRM Routes */}
          <Route path="/crm/dashboard" element={<CrmDashboardPage />} />
          <Route path="/crm/contacts" element={<ContactsPage />} />
          <Route path="/crm/contacts/:id" element={<ContactDetailsPage />} />
          <Route path="/crm/deals" element={<DealsPage />} />
          
          {/* Shared Routes */}
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
