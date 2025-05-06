
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ChevronRight, LayoutDashboard, Users } from "lucide-react";

const AppSwitcher = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine if we're in the CRM section
  const isInCrm = currentPath.startsWith("/crm");

  return (
    <div className="flex items-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-gradient-to-r from-background to-muted font-medium px-4">
              {isInCrm ? (
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  CRM
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-blue-500" />
                  Marketing Strategy
                </span>
              )}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[400px] md:grid-cols-2">
                <li>
                  <Link
                    to="/dashboard"
                    className={cn(
                      "flex h-full items-center gap-3 p-4 rounded-md hover:bg-accent group",
                      (!isInCrm) && "bg-blue-50 dark:bg-blue-950/30"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm",
                      (!isInCrm) && "border-blue-200 group-hover:border-blue-300 dark:border-blue-800"
                    )}>
                      <LayoutDashboard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Marketing Strategy</div>
                      <div className="text-sm text-muted-foreground">
                        Create and manage marketing strategies
                      </div>
                    </div>
                    {!isInCrm && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/crm/contacts"
                    className={cn(
                      "flex h-full items-center gap-3 p-4 rounded-md hover:bg-accent group",
                      isInCrm && "bg-green-50 dark:bg-green-950/30"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm",
                      isInCrm && "border-green-200 group-hover:border-green-300 dark:border-green-800"
                    )}>
                      <Users className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium">CRM</div>
                      <div className="text-sm text-muted-foreground">
                        Manage contacts and deals
                      </div>
                    </div>
                    {isInCrm && <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />}
                  </Link>
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
