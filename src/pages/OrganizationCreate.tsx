
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useOrganization } from "@/context/OrganizationProvider";
import NavBar from "@/components/NavBar";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens")
    .transform(val => val.toLowerCase()),
});

type FormValues = z.infer<typeof formSchema>;

export default function OrganizationCreate() {
  const navigate = useNavigate();
  const { createOrganization } = useOrganization();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });
  
  const isSubmitting = form.formState.isSubmitting;
  
  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    form.setValue("slug", slug);
  };
  
  const onSubmit = async (data: FormValues) => {
    try {
      const result = await createOrganization(data.name, data.slug);
      
      if (result) {
        toast.success(`Organization "${data.name}" created successfully!`);
        navigate('/');
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization");
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="My Company" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              handleNameChange(e);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization URL</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="bg-muted px-3 py-2 text-muted-foreground border border-r-0 rounded-l-md border-input">
                              marketingai.com/
                            </span>
                            <Input 
                              className="rounded-l-none" 
                              placeholder="my-company" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating..." : "Create Organization"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
