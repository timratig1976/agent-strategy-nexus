import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Phone, Mail, User, Plus, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Contact, Interaction, Deal, INTERACTION_TYPES, DEAL_STATUSES } from "@/types/crm";
import NavBar from "@/components/NavBar";

interface ContactDetailsPageProps { }

const ContactDetailsPage: React.FC<ContactDetailsPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for new interaction form
  const [newInteractionData, setNewInteractionData] = useState({
    type: "",
    description: "",
    date: new Date().toISOString(),
  });

  // State for new deal form
  const [newDealData, setNewDealData] = useState({
    name: "",
    status: "new",
    notes: "",
    amount: undefined as number | undefined,
    currency: "USD",
    expected_close_date: undefined as string | undefined,
  });

  // State for dialogs
  const [openInteractionDialog, setOpenInteractionDialog] = useState(false);
  const [openDealDialog, setOpenDealDialog] = useState(false);

  // Fetch contact details
  const { data: contact, isLoading: isContactLoading } = useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
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

      return data as Contact;
    },
    enabled: !!id, // Ensure ID is available before fetching
  });

  // Fetch interactions for the contact
  const { data: interactions = [], isLoading: isInteractionsLoading, refetch: refetchInteractions } = useQuery({
    queryKey: ["interactions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interactions")
        .select("*")
        .eq("contact_id", id)
        .order("created_at", { ascending: false });

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

  // Fetch deals for the contact
  const { data: deals = [], isLoading: isDealsLoading, refetch: refetchDeals } = useQuery({
    queryKey: ["deals", id],
    queryFn: async () => {
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

  useEffect(() => {
    if (id) {
      refetchInteractions();
      refetchDeals();
    }
  }, [id, refetchInteractions, refetchDeals]);

  // Mutations for adding interactions and deals
  const addInteractionMutation = useMutation({
    mutationFn: async () => {
      if (!newInteractionData.type || !newInteractionData.description) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("interactions").insert({
        contact_id: id,
        type: newInteractionData.type,
        description: newInteractionData.description,
        date: newInteractionData.date || new Date().toISOString(),
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Interaction added",
        description: "New interaction has been added to the contact",
      });
      setNewInteractionData({ type: "", description: "", date: new Date().toISOString() });
      setOpenInteractionDialog(false);
      queryClient.invalidateQueries({ queryKey: ["interactions", id] });
    },
    onError: (error: any) => {
      console.error("Error adding interaction:", error);
      toast({
        title: "Error",
        description: "Failed to add interaction",
        variant: "destructive",
      });
    },
  });

  const addDealMutation = useMutation({
    mutationFn: async () => {
      if (!newDealData.name) {
        toast({
          title: "Deal name is required",
          description: "Please enter a name for the deal",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("deals").insert({
        contact_id: id,
        name: newDealData.name,
        status: newDealData.status || "new",
        notes: newDealData.notes,
        amount: newDealData.amount,
        currency: newDealData.currency || "USD",
        expected_close_date: newDealData.expected_close_date,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Deal added",
        description: "New deal has been added to the contact",
      });
      setNewDealData({ name: "", status: "new", notes: "", amount: undefined, currency: "USD", expected_close_date: undefined });
      setOpenDealDialog(false);
      queryClient.invalidateQueries({ queryKey: ["deals", id] });
    },
    onError: (error: any) => {
      console.error("Error adding deal:", error);
      toast({
        title: "Error",
        description: "Failed to add deal",
        variant: "destructive",
      });
    },
  });

  const deleteContact = async () => {
    try {
      const { error } = await supabase.from("contacts").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Contact deleted",
        description: "The contact has been removed",
      });
      navigate("/crm/contacts");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive",
      });
    }
  };

  const deleteInteraction = async (interactionId: string) => {
    try {
      const { error } = await supabase.from("interactions").delete().eq("id", interactionId);

      if (error) throw error;

      toast({
        title: "Interaction deleted",
        description: "The interaction has been removed",
      });
      queryClient.invalidateQueries({ queryKey: ["interactions", id] });
    } catch (error) {
      console.error("Error deleting interaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete interaction",
        variant: "destructive",
      });
    }
  };

  const deleteDeal = async (dealId: string) => {
    try {
      const { error } = await supabase.from("deals").delete().eq("id", dealId);

      if (error) throw error;

      toast({
        title: "Deal deleted",
        description: "The deal has been removed",
      });
      queryClient.invalidateQueries({ queryKey: ["deals", id] });
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast({
        title: "Error",
        description: "Failed to delete deal",
        variant: "destructive",
      });
    }
  };

  function getStatusColor(status: string) {
    switch (status) {
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

  const formatCurrency = (amount?: number, currency = "USD") => {
    if (amount === undefined || amount === null) return "-";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  if (isContactLoading) {
    return <div className="container mx-auto p-4">Loading contact details...</div>;
  }

  if (!contact) {
    return <div className="container mx-auto p-4">Contact not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <NavBar />
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">{contact.name}</h1>
            <p className="text-muted-foreground">
              View and manage contact details, interactions, and deals
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => deleteContact()} className="text-red-600">
                Delete contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{contact.name}</span>
              </div>
              {contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${contact.email}`} className="hover:underline">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge>{contact.status}</Badge>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <h3 className="text-sm font-semibold">Notes</h3>
              <p className="text-muted-foreground">{contact.notes || "No notes available"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Interactions</CardTitle>
              <Dialog open={openInteractionDialog} onOpenChange={setOpenInteractionDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Interaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Interaction</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openInteractionDialog}
                            className="col-span-3 justify-start pl-3 text-left font-normal"
                          >
                            {newInteractionData.type
                              ? INTERACTION_TYPES.find((type) => type === newInteractionData.type)
                              : "Select type"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandList>
                              <CommandInput placeholder="Search type..." />
                              <CommandEmpty>No type found.</CommandEmpty>
                              <CommandGroup>
                                {INTERACTION_TYPES.map((type) => (
                                  <CommandItem
                                    key={type}
                                    value={type}
                                    onSelect={() => {
                                      setNewInteractionData({ ...newInteractionData, type });
                                    }}
                                  >
                                    {type}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={newInteractionData.description}
                        onChange={(e) =>
                          setNewInteractionData({ ...newInteractionData, description: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[200px] justify-start text-left font-normal",
                              !newInteractionData.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" />
                            {newInteractionData.date ? (
                              new Date(newInteractionData.date).toLocaleDateString()
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center" side="bottom">
                          <Calendar
                            mode="single"
                            selected={newInteractionData.date ? new Date(newInteractionData.date) : undefined}
                            onSelect={(date) =>
                              setNewInteractionData({
                                ...newInteractionData,
                                date: date?.toISOString() || new Date().toISOString(),
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={() => {
                        addInteractionMutation.mutate();
                      }}
                    >
                      Add Interaction
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isInteractionsLoading ? (
              <div className="flex justify-center items-center h-48">
                <p>Loading interactions...</p>
              </div>
            ) : interactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 p-4">
                <p className="text-muted-foreground mb-4">No interactions found</p>
                <Button variant="outline" onClick={() => setOpenInteractionDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add your first interaction
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interactions.map((interaction) => (
                      <TableRow key={interaction.id}>
                        <TableCell>{interaction.type}</TableCell>
                        <TableCell>{interaction.description}</TableCell>
                        <TableCell>{new Date(interaction.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => deleteInteraction(interaction.id)} className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Deals</CardTitle>
            <Dialog open={openDealDialog} onOpenChange={setOpenDealDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Deal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Deal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Deal Name
                    </Label>
                    <Input
                      id="name"
                      value={newDealData.name}
                      onChange={(e) => setNewDealData({ ...newDealData, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDealDialog}
                          className="col-span-3 justify-start pl-3 text-left font-normal"
                        >
                          {newDealData.status
                            ? DEAL_STATUSES.find((status) => status === newDealData.status)
                            : "Select status"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandInput placeholder="Search status..." />
                            <CommandEmpty>No status found.</CommandEmpty>
                            <CommandGroup>
                              {DEAL_STATUSES.map((status) => (
                                <CommandItem
                                  key={status}
                                  value={status}
                                  onSelect={() => {
                                    setNewDealData({ ...newDealData, status });
                                  }}
                                >
                                  {status}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      type="number"
                      id="amount"
                      value={newDealData.amount || ""}
                      onChange={(e) =>
                        setNewDealData({ ...newDealData, amount: parseFloat(e.target.value) })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="currency" className="text-right">
                      Currency
                    </Label>
                    <Input
                      id="currency"
                      value={newDealData.currency}
                      onChange={(e) => setNewDealData({ ...newDealData, currency: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="expected_close_date" className="text-right">
                      Expected Close Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !newDealData.expected_close_date && "text-muted-foreground"
                          )}
                        >
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {newDealData.expected_close_date ? (
                            new Date(newDealData.expected_close_date).toLocaleDateString()
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
                        <Calendar
                          mode="single"
                          selected={
                            newDealData.expected_close_date
                              ? new Date(newDealData.expected_close_date)
                              : undefined
                          }
                          onSelect={(date) =>
                            setNewDealData({
                              ...newDealData,
                              expected_close_date: date?.toISOString(),
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={newDealData.notes}
                      onChange={(e) => setNewDealData({ ...newDealData, notes: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => addDealMutation.mutate()}>
                    Add Deal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isDealsLoading ? (
            <div className="flex justify-center items-center h-48">
              <p>Loading deals...</p>
            </div>
          ) : deals.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 p-4">
              <p className="text-muted-foreground mb-4">No deals found</p>
              <Button variant="outline" onClick={() => setOpenDealDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add your first deal
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Expected Close Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>{deal.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(deal.status)}>
                          {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(deal.amount, deal.currency)}</TableCell>
                      <TableCell>
                        {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => deleteDeal(deal.id)} className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactDetailsPage;
