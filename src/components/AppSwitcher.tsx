
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ChevronRight, LayoutDashboard, Users } from "lucide-react";
import { Button } from "./ui/button";

const AppSwitcher = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine if we're in the CRM section
  const isInCrm = currentPath.startsWith("/crm");

  return (
    <div className="flex items-center gap-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-secondary/50 font-medium">
              {isInCrm ? "CRM" : "Marketing Strategy"}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[400px] md:grid-cols-2">
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/dashboard"
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-md hover:bg-accent",
                        (!isInCrm) && "bg-accent"
                      )}
                    >
                      <LayoutDashboard className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Marketing Strategy</div>
                        <div className="text-sm text-muted-foreground">
                          Create and manage marketing strategies
                        </div>
                      </div>
                      {!isInCrm && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />}
                    </Link>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/crm/contacts"
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-md hover:bg-accent",
                        isInCrm && "bg-accent"
                      )}
                    >
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">CRM</div>
                        <div className="text-sm text-muted-foreground">
                          Manage contacts and deals
                        </div>
                      </div>
                      {isInCrm && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />}
                    </Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default AppSwitcher;
