
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
import { ChevronRight, LayoutDashboard } from "lucide-react";

const AppSwitcher = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="flex items-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-gradient-to-r from-background to-muted font-medium px-4">
              <span className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-blue-500" />
                Marketing Strategy
              </span>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 w-[400px]">
                <li>
                  <Link
                    to="/dashboard"
                    className="flex h-full items-center gap-3 p-4 rounded-md hover:bg-accent group bg-blue-50 dark:bg-blue-950/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border bg-background shadow-sm border-blue-200 group-hover:border-blue-300 dark:border-blue-800">
                      <LayoutDashboard className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium">Marketing Strategy</div>
                      <div className="text-sm text-muted-foreground">
                        Create and manage marketing strategies
                      </div>
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
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
