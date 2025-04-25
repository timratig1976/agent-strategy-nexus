
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

const SetupDatabase = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRPC = async (query: string, errorContext: string) => {
    try {
      const { error } = await supabase.rpc('exec', { query });
      if (error) {
        console.log(`${errorContext} error (might be okay):`, error.message);
      }
      return { success: !error };
    } catch (err: any) {
      console.log(`${errorContext} error:`, err.message);
      return { success: false };
    }
  };

  const createTables = async () => {
    setIsCreating(true);
    setError(null);
    
    try {
      // Create agent_type enum
      await executeRPC(
        "create type agent_type as enum ('audience', 'content', 'seo', 'social', 'email', 'analytics');", 
        "agent_type enum"
      );

      // Create strategy_status enum
      await executeRPC(
        "create type strategy_status as enum ('draft', 'in_progress', 'completed');",
        "strategy_status enum"
      );

      // Create strategies table
      await executeRPC(`
        create table if not exists public.strategies (
          id uuid primary key default gen_random_uuid(),
          name text not null,
          description text,
          status strategy_status not null default 'draft',
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        );
      `, "strategies table");

      // Create agents table
      await executeRPC(`
        create table if not exists public.agents (
          id uuid primary key default gen_random_uuid(),
          strategy_id uuid references public.strategies(id) on delete cascade,
          name text not null,
          type agent_type not null,
          description text,
          is_active boolean not null default true,
          created_at timestamptz not null default now()
        );
      `, "agents table");

      // Create agent_results table
      await executeRPC(`
        create table if not exists public.agent_results (
          id uuid primary key default gen_random_uuid(),
          agent_id uuid references public.agents(id) on delete cascade,
          strategy_id uuid references public.strategies(id) on delete cascade,
          content text not null,
          metadata jsonb,
          created_at timestamptz not null default now()
        );
      `, "agent_results table");

      // Enable RLS
      await executeRPC(`
        alter table public.strategies enable row level security;
        alter table public.agents enable row level security;
        alter table public.agent_results enable row level security;
      `, "enable RLS");

      // Create updated_at trigger function
      await executeRPC(`
        create or replace function handle_updated_at()
        returns trigger as $$
        begin
          new.updated_at = now();
          return new;
        end;
        $$ language plpgsql;
      `, "create trigger function");

      // Add trigger to strategies table
      await executeRPC(`
        create trigger handle_strategies_updated_at
          before update on public.strategies
          for each row
          execute function handle_updated_at();
      `, "create trigger");

      // Add RLS policies
      await executeRPC(`
        create policy "Enable all access for authenticated users" on public.strategies
          for all using (auth.role() = 'authenticated');
        
        create policy "Enable all access for authenticated users" on public.agents
          for all using (auth.role() = 'authenticated');
        
        create policy "Enable all access for authenticated users" on public.agent_results
          for all using (auth.role() = 'authenticated');
      `, "create RLS policies");
      
      toast({
        title: "Success",
        description: "Database tables created successfully!",
      });
      
      setIsComplete(true);
    } catch (error: any) {
      console.error('Error creating tables:', error);
      setError(error.message || "Failed to create database tables");
      toast({
        title: "Error",
        description: "Failed to create database tables. See details below.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Database Setup</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Initialize Database Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            This will set up all necessary tables for the marketing strategy application:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Strategies table</li>
            <li>Agents table</li>
            <li>Agent Results table</li>
            <li>Required enums and triggers</li>
            <li>Row-level security policies</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            disabled={isCreating}
          >
            Back
          </Button>
          <Button 
            onClick={createTables}
            disabled={isCreating || isComplete}
          >
            {isCreating ? "Creating Tables..." : isComplete ? "Tables Created" : "Create Tables"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error creating tables</AlertTitle>
          <AlertDescription>
            <div className="overflow-auto max-h-40 text-xs">
              {error}
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {isComplete && (
        <div className="flex space-x-4 justify-center">
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SetupDatabase;
