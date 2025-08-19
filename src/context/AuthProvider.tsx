
import React, { createContext, useContext } from "react";
import { useAuth as useClerkAuth, useUser as useClerkUser } from "@clerk/clerk-react";
import { cleanupAuthState } from "@/utils/authUtils";

interface AuthContextProps {
  user: any | null;
  session: null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded: isAuthLoaded, signOut: clerkSignOut } = useClerkAuth();
  const { isLoaded: isUserLoaded, isSignedIn, user: clerkUser } = useClerkUser();

  const loading = !isAuthLoaded || !isUserLoaded;
  const user = isSignedIn ? clerkUser : null;
  const session = null;

  const signOut = async () => {
    try {
      cleanupAuthState();
      await clerkSignOut();
      window.location.href = '/auth';
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

