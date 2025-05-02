
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const SetupDatabase = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSQL = async (query: string, errorContext: string) => {
    try {
      const { data, error } = await supabase.rpc('exec', { query });
      
      if (error) {
        console.log(`${errorContext} error:`, error.message);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (err: any) {
      console.log(`${errorContext} exception:`, err.message);
      return { success: false, error: err.message };
    }
  };

  const createTables = async () => {
    setIsCreating(true);
    setError(null);
    
    try {
      // Create agent_type enum
      const agentTypeResult = await executeSQL(
        "create type if not exists agent_type as enum ('audience', 'content', 'seo', 'social', 'email', 'analytics');", 
        "agent_type enum"
      );
      
      if (!agentTypeResult.success && !agentTypeResult.error?.includes("already exists")) {
        throw new Error(`Failed to create agent_type enum: ${agentTypeResult.error}`);
      }

      // Create strategy_status enum
      const statusResult = await executeSQL(
        "create type if not exists strategy_status as enum ('draft', 'in_progress', 'completed');",
        "strategy_status enum"
      );
      
      if (!statusResult.success && !statusResult.error?.includes("already exists")) {
        throw new Error(`Failed to create strategy_status enum: ${statusResult.error}`);
      }

      // Create strategies table
      const strategiesResult = await executeSQL(`
        create table if not exists public.strategies (
          id uuid primary key default gen_random_uuid(),
          name text not null,
          description text,
          status strategy_status not null default 'draft',
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        );
      `, "strategies table");
      
      if (!strategiesResult.success) {
        throw new Error(`Failed to create strategies table: ${strategiesResult.error}`);
      }

      // Create agents table
      const agentsResult = await executeSQL(`
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
      
      if (!agentsResult.success) {
        throw new Error(`Failed to create agents table: ${agentsResult.error}`);
      }

      // Create agent_results table
      const resultsResult = await executeSQL(`
        create table if not exists public.agent_results (
          id uuid primary key default gen_random_uuid(),
          agent_id uuid references public.agents(id) on delete cascade,
          strategy_id uuid references public.strategies(id) on delete cascade,
          content text not null,
          metadata jsonb,
          created_at timestamptz not null default now()
        );
      `, "agent_results table");
      
      if (!resultsResult.success) {
        throw new Error(`Failed to create agent_results table: ${resultsResult.error}`);
      }

      // Enable RLS
      const rlsResult = await executeSQL(`
        alter table public.strategies enable row level security;
        alter table public.agents enable row level security;
        alter table public.agent_results enable row level security;
      `, "enable RLS");
      
      if (!rlsResult.success) {
        throw new Error(`Failed to enable RLS: ${rlsResult.error}`);
      }

      // Create updated_at trigger function
      const triggerFuncResult = await executeSQL(`
        create or replace function handle_updated_at()
        returns trigger as $$
        begin
          new.updated_at = now();
          return new;
        end;
        $$ language plpgsql;
      `, "create trigger function");
      
      if (!triggerFuncResult.success) {
        throw new Error(`Failed to create trigger function: ${triggerFuncResult.error}`);
      }

      // Add trigger to strategies table
      const triggerResult = await executeSQL(`
        drop trigger if exists handle_strategies_updated_at on public.strategies;
        create trigger handle_strategies_updated_at
          before update on public.strategies
          for each row
          execute function handle_updated_at();
      `, "create trigger");
      
      if (!triggerResult.success) {
        throw new Error(`Failed to create trigger: ${triggerResult.error}`);
      }

      // Add RLS policies
      const policiesResult = await executeSQL(`
        drop policy if exists "Enable all access for authenticated users" on public.strategies;
        create policy "Enable all access for authenticated users" on public.strategies
          for all using (auth.role() = 'authenticated');
        
        drop policy if exists "Enable all access for authenticated users" on public.agents;
        create policy "Enable all access for authenticated users" on public.agents
          for all using (auth.role() = 'authenticated');
        
        drop policy if exists "Enable all access for authenticated users" on public.agent_results;
        create policy "Enable all access for authenticated users" on public.agent_results
          for all using (auth.role() = 'authenticated');
      `, "create RLS policies");
      
      if (!policiesResult.success) {
        throw new Error(`Failed to create RLS policies: ${policiesResult.error}`);
      }
      
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
          <p className="text-amber-600 font-medium mb-4">
            Important: Make sure the SQL RPC function is enabled in your Supabase project.
          </p>
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
