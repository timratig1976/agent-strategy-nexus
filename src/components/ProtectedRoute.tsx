
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingIndicator from "@/components/marketing/ai-prompt-manager/LoadingIndicator";

/**
 * Enhanced ProtectedRoute component that redirects unauthenticated users
 * and provides a consistent loading state
 */
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;
