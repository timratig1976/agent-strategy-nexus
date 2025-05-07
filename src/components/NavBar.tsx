
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Settings, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSwitcher from "./AppSwitcher";

export default function NavBar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Get the current route for active link highlighting
  const currentRoute = location.pathname;
  
  // Define navigation items
  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Strategies", href: "/create-strategy" },
    { name: "Company", href: "/company-summary" },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const mobileNavigation = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="font-semibold">Marketing</span>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="py-4">
            <AppSwitcher />
          </div>

          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2 block py-2 px-3 rounded-md transition-colors",
                      currentRoute === item.href
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-accent/50"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {user && (
            <div className="pt-4 border-t">
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {user.email}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-semibold text-lg mr-6">
            Marketing Hub
          </Link>

          {!isMobile && (
            <>
              {user && <AppSwitcher />}
              
              <nav className="hidden ml-6 md:flex items-center gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2",
                      currentRoute === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {item.icon ? <item.icon className="h-4 w-4" /> : null}
                    {item.name === "Settings" && !item.icon ? null : item.name}
                  </Link>
                ))}
              </nav>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isMobile && user ? mobileNavigation : null}
        </div>
      </div>
    </header>
  );
}
