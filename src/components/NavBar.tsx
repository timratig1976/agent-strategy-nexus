
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CompanyLogo from "./CompanyLogo";
import { useAuth } from "@/context/AuthProvider";
import { Building, ChevronDown, Home, Settings, LogOut, User, Users } from "lucide-react";
import { useOrganization } from "@/context/OrganizationProvider";
import OrganizationSelector from "./organizations/OrganizationSelector";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { currentOrganization } = useOrganization();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
          <div className="flex items-center gap-4">
            <OrganizationSelector />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 flex items-center">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">Account</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user.email}
                </div>
                <DropdownMenuSeparator />
                
                {currentOrganization && (
                  <>
                    <Link to={`/organizations/${currentOrganization.id}/settings`}>
                      <DropdownMenuItem className="cursor-pointer">
                        <Building className="mr-2 h-4 w-4" />
                        <span>Organization</span>
                      </DropdownMenuItem>
                    </Link>
                  </>
                )}
                
                <Link to="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
