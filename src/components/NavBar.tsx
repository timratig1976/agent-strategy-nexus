
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CompanyLogo from "./CompanyLogo";
import { useAuth } from "@/context/AuthProvider";
import { Building, Home, Settings } from "lucide-react";
import { useOrganization } from "@/context/OrganizationProvider";
import OrganizationSelector from "./organizations/OrganizationSelector";
import { UserButton } from "@clerk/clerk-react";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Sign out handled via Clerk UserButton menu

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-4">
          <Link to="/">
            <CompanyLogo />
          </Link>

          {user && (
            <>
              <div className="hidden md:flex gap-1">
                <Link to="/">
                  <Button
                    variant={isActive("/") ? "secondary" : "ghost"}
                    size="sm"
                    className="text-base"
                  >
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant={isActive("/dashboard") ? "secondary" : "ghost"}
                    size="sm"
                    className="text-base"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/marketing-hub">
                  <Button
                    variant={isActive("/marketing-hub") ? "secondary" : "ghost"}
                    size="sm"
                    className="text-base"
                  >
                    Marketing Hub
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4 ml-auto">
            <OrganizationSelector />
            {currentOrganization && (
              <Link to={`/organizations/${currentOrganization.id}/settings`}>
                <Button variant="ghost" size="icon" aria-label="Organization Settings" title="Organization Settings">
                  <Building className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to="/settings">
              <Button variant="ghost" size="icon" aria-label="Settings" title="Settings">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <UserButton appearance={{ elements: { userButtonPopoverCard: "shadow-lg" } }} userProfileMode="modal" afterSignOutUrl="/" />
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
