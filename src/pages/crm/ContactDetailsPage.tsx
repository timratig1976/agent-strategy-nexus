
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CalendarClock, Mail, Phone, Building, FileEdit, 
  ArrowLeft, Plus, AlertCircle, MoreHorizontal 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Contact, Interaction, Deal, CONTACT_STATUSES, INTERACTION_TYPES, DEAL_STATUSES } from "@/types/crm";
import NavBar from "@/components/NavBar";

// Interaction form schema
const interactionFormSchema = z.object({
  type: z.string(),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().default(() => new Date().toISOString()),
});

type InteractionFormValues = z.infer<typeof interactionFormSchema>;

// Contact form schema for editing
const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  company: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  status: z.string(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Deal form schema
const dealFormSchema = z.object({
  name: z.string().min(1, { message: "Deal name is required" }),
  amount: z.coerce.number().optional(),
  currency: z.string().default("USD"),
  status: z.string().default("new"),
  expected_close_date: z.string().optional().or(z.literal("")),
  notes: z.string().optional(),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

const ContactDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditContactDialogOpen, setIsEditContactDialogOpen] = useState(false);
  const [isAddInteractionDialogOpen, setIsAddInteractionDialogOpen] = useState(false);
  const [isAddDealDialogOpen, setIsAddDealDialogOpen] = useState(false);

  // Forms
  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const interactionForm = useForm<InteractionFormValues>({
    resolver: zodResolver(interactionFormSchema),
    defaultValues: {
      type: "note",
      description: "",
      date: new Date().toISOString(),
    },
  });

  const dealForm = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      name: "",
      status: "new",
      currency: "USD",
    },
  });

  // Fetch contact details
  const { data: contact, isLoading: isLoadingContact } = useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      if (!id) throw new Error("Contact ID is required");

      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch contact details",
          variant: "destructive",
        });
        throw error;
      }

      // Set form default values
      contactForm.reset({
        name: data.name,
        company: data.company || "",
        email: data.email || "",
        phone: data.phone || "",
        status: data.status,
        source: data.source || "",
        notes: data.notes || "",
      });

      return data as Contact;
    },
    enabled: !!id,
  });

  // Fetch interactions
  const { data: interactions = [], isLoading: isLoadingInteractions } = useQuery({
    queryKey: ["interactions", id],
    queryFn: async () => {
      if (!id) throw new Error("Contact ID is required");

      const { data, error } = await supabase
        .from("interactions")
        .select("*")
        .eq("contact_id", id)
        .order("date", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch interactions",
          variant: "destructive",
        });
        throw error;
      }

      return data as Interaction[];
    },
    enabled: !!id,
  });

  // Fetch deals
  const { data: deals = [], isLoading: isLoadingDeals } = useQuery({
    queryKey: ["deals", id],
    queryFn: async () => {
      if (!id) throw new Error("Contact ID is required");

      const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("contact_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Could not fetch deals",
          variant: "destructive",
        });
        throw error;
      }

      return data as Deal[];
    },
    enabled: !!id,
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: async (values: ContactFormValues) => {
      if (!id) throw new Error("Contact ID is required");

      const { error } = await supabase
        .from("contacts")
        .update(values)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact", id] });
      setIsEditContactDialogOpen(false);
      toast({
        title: "Contact updated",
        description: "The contact information has been updated",
      });
    },
    onError: (error) => {
      console.error("Error updating contact:", error);
      toast({
        title: "Error",
        description: "Failed to update contact",
        variant: "destructive",
      });
    },
  });

  // Add interaction mutation
  const addInteractionMutation = useMutation({
    mutationFn: async (values: InteractionFormValues) => {
      if (!id) throw new Error("Contact ID is required");

      const { error } = await supabase
        .from("interactions")
        .insert({
          ...values,
          contact_id: id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions", id] });
      setIsAddInteractionDialogOpen(false);
      interactionForm.reset({
        type: "note",
        description: "",
        date: new Date().toISOString(),
      });
      toast({
        title: "Interaction added",
        description: "The interaction has been recorded",
      });
    },
    onError: (error) => {
      console.error("Error adding interaction:", error);
      toast({
        title: "Error",
        description: "Failed to add interaction",
        variant: "destructive",
      });
    },
  });

  // Add deal mutation
  const addDealMutation = useMutation({
    mutationFn: async (values: DealFormValues) => {
      if (!id) throw new Error("Contact ID is required");

      const { error } = await supabase
        .from("deals")
        .insert({
          ...values,
          contact_id: id,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals", id] });
      setIsAddDealDialogOpen(false);
      dealForm.reset({
        name: "",
        status: "new",
        currency: "USD",
      });
      toast({
        title: "Deal added",
        description: "The new deal has been added",
      });
    },
    onError: (error) => {
      console.error("Error adding deal:", error);
      toast({
        title: "Error",
        description: "Failed to add deal",
        variant: "destructive",
      });
    },
  });

  // Delete interaction mutation
  const deleteInteractionMutation = useMutation({
    mutationFn: async (interactionId: string) => {
      const { error } = await supabase
        .from("interactions")
        .delete()
        .eq("id", interactionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions", id] });
      toast({
        title: "Interaction deleted",
        description: "The interaction has been removed",
      });
    },
    onError: (error) => {
      console.error("Error deleting interaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete interaction",
        variant: "destructive",
      });
    },
  });

  // Delete deal mutation
  const deleteDealMutation = useMutation({
    mutationFn: async (dealId: string) => {
      const { error } = await supabase
        .from("deals")
        .delete()
        .eq("id", dealId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals", id] });
      toast({
        title: "Deal deleted",
        description: "The deal has been removed",
      });
    },
    onError: (error) => {
      console.error("Error deleting deal:", error);
      toast({
        title: "Error",
        description: "Failed to delete deal",
        variant: "destructive",
      });
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Contact ID is required");

      const { error } = await supabase
        .from("contacts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      navigate("/crm/contacts");
      toast({
        title: "Contact deleted",
        description: "The contact has been removed",
      });
    },
    onError: (error) => {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    },
  });

  const onContactSubmit = (values: ContactFormValues) => {
    updateContactMutation.mutate(values);
  };

  const onInteractionSubmit = (values: InteractionFormValues) => {
    addInteractionMutation.mutate(values);
  };

  const onDealSubmit = (values: DealFormValues) => {
    addDealMutation.mutate(values);
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "lead":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "prospect":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "customer":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "churned":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      // Deal statuses
      case "new":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "qualified":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "proposal":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "negotiation":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "won":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "lost":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  }

  function getInteractionTypeIcon(type: string) {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      case "meeting":
        return <CalendarClock className="h-4 w-4" />;
      case "note":
      default:
        return <FileEdit className="h-4 w-4" />;
    }
  }

  if (isLoadingContact) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <p>Loading contact details...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Contact Not Found</h1>
          <p className="text-muted-foreground mb-4">The contact you're looking for doesn't exist or has been removed</p>
          <Button onClick={() => navigate("/crm/contacts")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <NavBar />
      
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate("/crm/contacts")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="ml-auto flex gap-2">
          <Dialog open={isEditContactDialogOpen} onOpenChange={setIsEditContactDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Edit Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Contact</DialogTitle>
              </DialogHeader>
              <Form {...contactForm}>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                  <FormField
                    control={contactForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={contactForm.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CONTACT_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Source</FormLabel>
                          <FormControl>
                            <Input placeholder="Website, Referral, etc." {...field} value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={contactForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional information about this contact" 
                            {...field} 
                            value={field.value || ""} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsEditContactDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Button variant="destructive" onClick={() => {
            if (window.confirm("Are you sure you want to delete this contact? This action cannot be undone.")) {
              deleteContactMutation.mutate();
            }
          }}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Contact Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Contact Information</span>
              <Badge className={getStatusColor(contact.status)}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{contact.name}</h3>
                {contact.company && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Building className="h-4 w-4 mr-2" />
                    {contact.company}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {contact.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                      {contact.email}
                    </a>
                  </div>
                )}
                
                {contact.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                      {contact.phone}
                    </a>
                  </div>
                )}
              </div>
              
              {contact.source && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Source</h4>
                  <p>{contact.source}</p>
                </div>
              )}
              
              {contact.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                  <p className="whitespace-pre-wrap">{contact.notes}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                <p>{new Date(contact.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Interactions and Deals */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="interactions">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="interactions">Interactions</TabsTrigger>
                  <TabsTrigger value="deals">Deals</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Dialog open={isAddInteractionDialogOpen} onOpenChange={setIsAddInteractionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="tabindex-interactions">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Interaction
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New Interaction</DialogTitle>
                      </DialogHeader>
                      <Form {...interactionForm}>
                        <form onSubmit={interactionForm.handleSubmit(onInteractionSubmit)} className="space-y-4">
                          <FormField
                            control={interactionForm.control}
                            name="type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {INTERACTION_TYPES.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interactionForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Details about the interaction" 
                                    {...field} 
                                    className="min-h-[100px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={interactionForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="datetime-local" 
                                    {...field}
                                    value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ""}
                                    onChange={(e) => {
                                      const date = e.target.value ? new Date(e.target.value).toISOString() : "";
                                      field.onChange(date);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">Add Interaction</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isAddDealDialogOpen} onOpenChange={setIsAddDealDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="tabindex-deals">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Deal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New Deal</DialogTitle>
                      </DialogHeader>
                      <Form {...dealForm}>
                        <form onSubmit={dealForm.handleSubmit(onDealSubmit)} className="space-y-4">
                          <FormField
                            control={dealForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Deal Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Project name or opportunity" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={dealForm.control}
                              name="amount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Amount</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="0.00" 
                                      {...field} 
                                      value={field.value === undefined ? "" : field.value}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={dealForm.control}
                              name="currency"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Currency</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select currency" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="USD">USD ($)</SelectItem>
                                      <SelectItem value="EUR">EUR (€)</SelectItem>
                                      <SelectItem value="GBP">GBP (£)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={dealForm.control}
                              name="status"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Status</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a status" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {DEAL_STATUSES.map((status) => (
                                        <SelectItem key={status} value={status}>
                                          {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={dealForm.control}
                              name="expected_close_date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Expected Close Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      {...field}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={dealForm.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Additional details about this deal" 
                                    {...field} 
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit">Add Deal</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <TabsContent value="interactions" className="space-y-4">
                {isLoadingInteractions ? (
                  <div className="flex justify-center items-center h-48">
                    <p>Loading interactions...</p>
                  </div>
                ) : interactions.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">No interactions recorded yet</p>
                    <Button variant="outline" onClick={() => setIsAddInteractionDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add first interaction
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interactions.map((interaction) => (
                      <Card key={interaction.id} className="overflow-hidden">
                        <div className="flex justify-between items-start p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${getStatusColor(interaction.type)}`}>
                              {getInteractionTypeIcon(interaction.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium capitalize">{interaction.type}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(interaction.date).toLocaleString()}
                                </span>
                              </div>
                              <p className="mt-1 whitespace-pre-wrap">{interaction.description}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => deleteInteractionMutation.mutate(interaction.id)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="deals" className="space-y-4">
                {isLoadingDeals ? (
                  <div className="flex justify-center items-center h-48">
                    <p>Loading deals...</p>
                  </div>
                ) : deals.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground mb-4">No deals recorded yet</p>
                    <Button variant="outline" onClick={() => setIsAddDealDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add first deal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deals.map((deal) => (
                      <Card key={deal.id}>
                        <div className="p-4 flex justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{deal.name}</h3>
                              <Badge className={getStatusColor(deal.status)}>
                                {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                              </Badge>
                            </div>
                            {deal.amount && (
                              <p className="font-medium text-lg">
                                {new Intl.NumberFormat('en-US', { 
                                  style: 'currency', 
                                  currency: deal.currency || 'USD' 
                                }).format(deal.amount)}
                              </p>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {deal.expected_close_date && (
                                <p>Expected close: {new Date(deal.expected_close_date).toLocaleDateString()}</p>
                              )}
                              <p>Created: {new Date(deal.created_at).toLocaleDateString()}</p>
                            </div>
                            {deal.notes && <p className="text-sm mt-2">{deal.notes}</p>}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => deleteDealMutation.mutate(deal.id)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ContactDetailsPage;
