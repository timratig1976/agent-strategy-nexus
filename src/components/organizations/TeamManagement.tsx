
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganization } from "@/context/OrganizationProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Team } from "@/types/organization";
import { toast } from "sonner";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  description: z.string().optional(),
});

type TeamFormValues = z.infer<typeof teamSchema>;

export default function TeamManagement() {
  const { currentOrganization } = useOrganization();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  
  // Query teams
  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams', currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization) return [];
      
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('organization_id', currentOrganization.id);
        
      if (error) throw error;
      return data as Team[];
    },
    enabled: !!currentOrganization,
  });
  
  // Create team mutation
  const createTeamMutation = useMutation({
    mutationFn: async (values: TeamFormValues) => {
      if (!currentOrganization) throw new Error("No organization selected");
      
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: values.name,
          description: values.description || "",
          organization_id: currentOrganization.id,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', currentOrganization?.id] });
      setIsDialogOpen(false);
      form.reset();
      toast.success("Team created successfully");
    },
    onError: (error) => {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    },
  });
  
  // Update team mutation
  const updateTeamMutation = useMutation({
    mutationFn: async (values: TeamFormValues & { id: string }) => {
      const { data, error } = await supabase
        .from('teams')
        .update({
          name: values.name,
          description: values.description || "",
        })
        .eq('id', values.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', currentOrganization?.id] });
      setIsDialogOpen(false);
      setEditingTeam(null);
      form.reset();
      toast.success("Team updated successfully");
    },
    onError: (error) => {
      console.error("Error updating team:", error);
      toast.error("Failed to update team");
    },
  });
  
  // Delete team mutation
  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', currentOrganization?.id] });
      toast.success("Team deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    },
  });
  
  const onSubmit = async (values: TeamFormValues) => {
    if (editingTeam) {
      updateTeamMutation.mutate({ ...values, id: editingTeam.id });
    } else {
      createTeamMutation.mutate(values);
    }
  };
  
  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    form.reset({
      name: team.name,
      description: team.description || '',
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      deleteTeamMutation.mutate(teamId);
    }
  };
  
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingTeam(null);
      form.reset();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Teams</h2>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTeam ? 'Edit Team' : 'Create Team'}</DialogTitle>
              <DialogDescription>
                {editingTeam 
                  ? 'Update your team details below.' 
                  : 'Create a new team to organize your strategies and members.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Marketing Team" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Team responsible for marketing strategies" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createTeamMutation.isPending || updateTeamMutation.isPending}
                  >
                    {(createTeamMutation.isPending || updateTeamMutation.isPending) && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    {editingTeam ? 'Update Team' : 'Create Team'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : teams && teams.length > 0 ? (
        <div className="border rounded-md divide-y">
          {teams.map((team) => (
            <div key={team.id} className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{team.name}</h3>
                {team.description && (
                  <p className="text-sm text-muted-foreground">{team.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEdit(team)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(team.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground mb-4">No teams created yet</p>
          <Button 
            variant="outline" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Create your first team
          </Button>
        </div>
      )}
    </div>
  );
}
