import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingIndicator from "@/components/marketing/ai-prompt-manager/LoadingIndicator";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";

/**
 * Enhanced ProtectedRoute component that redirects unauthenticated users
 * and provides a consistent loading state
 */
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const { isLoaded: isClerkLoaded, isSignedIn } = useClerkAuth();
  const location = useLocation();

  // Show loading while either auth system is resolving
  if (loading || !isClerkLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  // Prefer Clerk when available
  if (isSignedIn) {
    return <Outlet />;
  }

  // Fallback to legacy Supabase auth
  return user ? <Outlet /> : <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;
