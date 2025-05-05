
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { Home, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NavBar = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    navigate("/auth");
  };

  const handleHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-end items-center gap-2 p-4">
      <Button variant="outline" size="sm" onClick={handleHome}>
        <Home className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default NavBar;
