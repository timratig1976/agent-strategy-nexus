
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CompanySettings = {
  name: string;
  website: string;
  logo_url: string;
};

interface CompanyProfileTabProps {
  userId: string | undefined;
  defaultValues: CompanySettings;
}

export const CompanyProfileTab: React.FC<CompanyProfileTabProps> = ({ userId, defaultValues }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(defaultValues.logo_url || null);

  const form = useForm<CompanySettings>({
    defaultValues,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: CompanySettings) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      
      let logo_url = form.getValues("logo_url");

      // Upload logo if a new one was selected
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `${userId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("company_logos")
          .upload(filePath, logoFile, {
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("company_logos")
          .getPublicUrl(filePath);

        logo_url = urlData.publicUrl;
      }

      // Check if settings already exist
      const { data: existingData } = await supabase
        .from("company_settings")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingData) {
        // Update existing settings
        const { error } = await supabase
          .from("company_settings")
          .update({
            name: data.name,
            website: data.website,
            logo_url,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Insert new settings
        const { error } = await supabase
          .from("company_settings")
          .insert({
            user_id: userId,
            name: data.name,
            website: data.website,
            logo_url,
          });

        if (error) throw error;
      }

      toast.success("Company settings saved successfully.");
    } catch (error) {
      console.error("Error saving company settings:", error);
      toast.error("Failed to save company settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>
          Manage your company information that will appear throughout the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be displayed throughout the application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your company's website URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Company Logo</FormLabel>
              <div className="flex items-start gap-4">
                <div>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="max-w-sm"
                  />
                  <FormDescription>
                    Upload your company logo. Recommended size: 512x512px.
                  </FormDescription>
                </div>
                {logoPreview && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Preview:</p>
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-20 h-20 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            </FormItem>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CompanyProfileTab;
