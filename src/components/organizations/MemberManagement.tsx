
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/context/OrganizationProvider";
import { OrganizationMember, UserRole } from "@/types/organization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Loader2, Mail, MoreHorizontal, Shield, User } from "lucide-react";

// Form schema for inviting members
const inviteFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["member", "admin", "viewer"], {
    required_error: "Please select a role",
  }),
});

// Form schema for changing role
const changeRoleSchema = z.object({
  role: z.enum(["member", "admin", "viewer"], {
    required_error: "Please select a role",
  }),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;
type ChangeRoleFormValues = z.infer<typeof changeRoleSchema>;

// Helper to get the initials from name or email
const getInitials = (nameOrEmail: string): string => {
  if (!nameOrEmail) return "?";
  
  if (nameOrEmail.includes("@")) {
    // It's an email, use first letter
    return nameOrEmail.charAt(0).toUpperCase();
  }
  
  // It's a name, get initials
  return nameOrEmail
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to get role badge styling
const getRoleBadgeClass = (role: UserRole): string => {
  switch (role) {
    case "owner":
      return "bg-purple-100 text-purple-800";
    case "admin":
      return "bg-blue-100 text-blue-800";
    case "member":
      return "bg-green-100 text-green-800";
    case "viewer":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Role icon component
const RoleIcon = ({ role }: { role: UserRole }) => {
  switch (role) {
    case "owner":
      return <Shield className="h-4 w-4 mr-2" />;
    case "admin":
      return <Shield className="h-4 w-4 mr-2" />;
    case "member":
      return <User className="h-4 w-4 mr-2" />;
    case "viewer":
      return <User className="h-4 w-4 mr-2" />;
    default:
      return <User className="h-4 w-4 mr-2" />;
  }
};

const MemberManagement: React.FC = () => {
  const { currentOrganization } = useOrganization();
  const queryClient = useQueryClient();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null);
  
  // Form for inviting new members
  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });
  
  // Form for changing role
  const changeRoleForm = useForm<ChangeRoleFormValues>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: {
      role: "member",
    },
  });
  
  // Load current role when selected member changes
  useEffect(() => {
    if (selectedMember) {
      changeRoleForm.setValue("role", selectedMember.role as any);
    }
  }, [selectedMember, changeRoleForm]);
  
  // Query to fetch organization members
  const { data: members, isLoading } = useQuery({
    queryKey: ['organization-members', currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization?.id) return [];
      
      // Use the stored function to get member profiles
      const { data, error } = await supabase
        .rpc('get_org_member_profiles', { org_id: currentOrganization.id });
        
      if (error) {
        console.error("Error fetching members:", error);
        throw error;
      }
      
      return data as OrganizationMember[];
    },
    enabled: !!currentOrganization?.id
  });
  
  // Mutation for inviting members
  const inviteMutation = useMutation({
    mutationFn: async (values: InviteFormValues) => {
      if (!currentOrganization) throw new Error("No organization selected");
      
      // First check if the user already exists
      const { data: existingUser } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', values.email)
        .single();
      
      let userId;
      
      if (existingUser) {
        userId = existingUser.id;
      } else {
        // In a real implementation, we'd send an email invitation
        // For now, we'll just show a message that we'd send an invitation
        toast.info(`Invitation would be sent to ${values.email}`);
        return { success: true, message: "Invitation sent" };
      }
      
      // Add member to organization
      const { error } = await supabase
        .from('org_memberships')
        .insert({
          user_id: userId,
          organization_id: currentOrganization.id,
          role: values.role,
          is_primary: false
        });
        
      if (error) throw error;
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Member added to organization");
      setInviteDialogOpen(false);
      inviteForm.reset();
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
    },
    onError: (error) => {
      console.error("Error inviting member:", error);
      toast.error("Failed to add member");
    }
  });
  
  // Mutation for changing role
  const changeRoleMutation = useMutation({
    mutationFn: async (values: ChangeRoleFormValues) => {
      if (!selectedMember || !currentOrganization) {
        throw new Error("No member or organization selected");
      }
      
      // Cannot change role of owner
      if (selectedMember.role === "owner") {
        throw new Error("Cannot change role of organization owner");
      }
      
      const { error } = await supabase
        .from('org_memberships')
        .update({ role: values.role })
        .eq('id', selectedMember.id);
        
      if (error) throw error;
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Member role updated");
      setChangeRoleDialogOpen(false);
      setSelectedMember(null);
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
    },
    onError: (error) => {
      console.error("Error changing role:", error);
      toast.error("Failed to update role");
    }
  });
  
  // Mutation for removing members
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!currentOrganization) throw new Error("No organization selected");
      
      const { error } = await supabase
        .from('org_memberships')
        .delete()
        .eq('id', memberId);
        
      if (error) throw error;
      
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Member removed from organization");
      queryClient.invalidateQueries({ queryKey: ['organization-members'] });
    },
    onError: (error) => {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  });
  
  const handleInvite = (values: InviteFormValues) => {
    inviteMutation.mutate(values);
  };
  
  const handleChangeRole = (values: ChangeRoleFormValues) => {
    changeRoleMutation.mutate(values);
  };
  
  const handleRemoveMember = (member: OrganizationMember) => {
    // Cannot remove owner
    if (member.role === "owner") {
      toast.error("Cannot remove organization owner");
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove ${member.display_name || member.email} from the organization?`)) {
      removeMemberMutation.mutate(member.id);
    }
  };
  
  if (!currentOrganization) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>
            Select an organization to manage members
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>
            Manage members of {currentOrganization.name}
          </CardDescription>
        </div>
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Member</DialogTitle>
              <DialogDescription>
                Invite a new member to join your organization
              </DialogDescription>
            </DialogHeader>
            <Form {...inviteForm}>
              <form onSubmit={inviteForm.handleSubmit(handleInvite)} className="space-y-4">
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={inviteForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        <span className="flex items-center mt-1">
                          <Shield className="h-3 w-3 mr-1" />
                          <span className="text-xs">
                            {field.value === "admin" ? "Can manage organization settings and members" : 
                             field.value === "member" ? "Can create and edit strategies" :
                             "Can view strategies but not edit them"}
                          </span>
                        </span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setInviteDialogOpen(false)}
                    disabled={inviteMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={inviteMutation.isPending}
                  >
                    {inviteMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Inviting...
                      </>
                    ) : (
                      <>Invite</>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : members && members.length > 0 ? (
          <div className="space-y-4">
            {members.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between border rounded-md p-4"
              >
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    {member.avatar_url ? (
                      <AvatarImage src={member.avatar_url} alt={member.display_name || member.email || ""} />
                    ) : null}
                    <AvatarFallback>
                      {getInitials(member.display_name || member.email || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{member.display_name || member.email}</h3>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${getRoleBadgeClass(member.role as UserRole)}`}>
                    <RoleIcon role={member.role as UserRole} />
                    {member.role}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={member.role === "owner"}>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          setSelectedMember(member);
                          setChangeRoleDialogOpen(true);
                        }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Change Role
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleRemoveMember(member)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Remove from Organization
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No members found in this organization.
          </div>
        )}
      </CardContent>
      
      {/* Change Role Dialog */}
      <Dialog open={changeRoleDialogOpen} onOpenChange={setChangeRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update role for {selectedMember?.display_name || selectedMember?.email}
            </DialogDescription>
          </DialogHeader>
          <Form {...changeRoleForm}>
            <form onSubmit={changeRoleForm.handleSubmit(handleChangeRole)} className="space-y-4">
              <FormField
                control={changeRoleForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      <span className="flex items-center mt-1">
                        <Shield className="h-3 w-3 mr-1" />
                        <span className="text-xs">
                          {field.value === "admin" ? "Can manage organization settings and members" : 
                          field.value === "member" ? "Can create and edit strategies" :
                          "Can view strategies but not edit them"}
                        </span>
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setChangeRoleDialogOpen(false)}
                  disabled={changeRoleMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={changeRoleMutation.isPending}
                >
                  {changeRoleMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MemberManagement;
