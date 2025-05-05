
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
    const fetchCompanySettings = async () => {
      if (!user) return;

      try {
        // Use maybeSingle instead of single to handle the case where no data is found
        const { data, error } = await supabase
          .from("company_settings")
          .select("name, logo_url")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching company settings:", error);
          return;
        }

        if (data) {
          setLogoUrl(data.logo_url);
          setCompanyName(data.name || "");
        }
      } catch (error) {
        console.error("Error fetching company settings:", error);
      }
    };

    fetchCompanySettings();
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
