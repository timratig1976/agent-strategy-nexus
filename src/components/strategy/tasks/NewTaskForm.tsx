
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NewTaskFormProps } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { StrategyTask, StrategyState } from "@/types/marketing";

const NewTaskForm = ({ strategyId, state, onTaskAdded, onCancel }: NewTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Ensure we're using a valid StrategyState value as expected by the database
      const validState = Object.values(StrategyState).includes(state as StrategyState) 
        ? state 
        : StrategyState.BRIEFING;
        
      // Insert the new task into the database
      const { data, error } = await supabase
        .from('strategy_tasks')
        .insert({
          strategy_id: strategyId,
          title,
          state: validState,
          is_completed: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Map to our StrategyTask type
        const newTask: StrategyTask = {
          id: data.id,
          strategyId: data.strategy_id,
          title: data.title,
          description: data.description || '',
          state: data.state,
          isCompleted: data.is_completed,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
        
        onTaskAdded(newTask);
        setTitle("");
      }
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
        disabled={isSubmitting}
      />
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          size="sm" 
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </Button>
      </div>
    </form>
  );
};

export default NewTaskForm;
