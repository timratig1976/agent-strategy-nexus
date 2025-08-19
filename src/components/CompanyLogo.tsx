
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";

interface CompanyLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const CompanyLogo = ({ size = "md", className = "" }: CompanyLogoProps) => {
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    // Supabase disabled during migration; use placeholder initial
    if (user?.email) {
      const initial = user.email.charAt(0).toUpperCase();
      setCompanyName(initial);
    } else {
      setCompanyName("C");
    }
  }, [user]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  if (!logoUrl) {
    // If no logo is set, show a placeholder with the first letter of the company name
    const initial = companyName ? companyName.charAt(0).toUpperCase() : "C";
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 rounded ${
          sizeClasses[size]
        } ${className}`}
      >
        <span className="text-gray-700 font-bold">{initial}</span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt="Company logo"
      className={`object-contain rounded ${sizeClasses[size]} ${className}`}
    />
  );
};

export default CompanyLogo;
