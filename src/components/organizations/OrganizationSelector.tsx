
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/context/OrganizationProvider";
import { useNavigate } from "react-router-dom";

export default function OrganizationSelector() {
  const { organizations, currentOrganization, setCurrentOrganization } = useOrganization();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleOrganizationSelect = (orgId: string) => {
    const org = organizations.find(org => org.id === orgId);
    if (org) {
      setCurrentOrganization(org);
    }
    setOpen(false);
  };
  
  const handleCreateNew = () => {
    navigate('/organizations/new');
    setOpen(false);
  };

  if (!currentOrganization) {
    return (
      <Button
        variant="outline"
        onClick={handleCreateNew}
        className="flex items-center gap-2 h-9"
      >
        <Plus size={16} /> Create Organization
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          {currentOrganization?.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <div className="max-h-[300px] overflow-auto">
          {organizations.map((org) => (
            <div
              key={org.id}
              className={cn(
                "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent",
                org.id === currentOrganization?.id && "bg-muted"
              )}
              onClick={() => handleOrganizationSelect(org.id)}
            >
              <span>{org.name}</span>
              {org.id === currentOrganization?.id && (
                <Check className="h-4 w-4" />
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start rounded-none px-3 py-2 h-auto font-normal"
            onClick={handleCreateNew}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Organization
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
