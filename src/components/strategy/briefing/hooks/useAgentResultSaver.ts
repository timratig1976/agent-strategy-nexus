
import { toast } from "sonner";
import { AgentResult } from "@/types/marketing";
import { supabase } from "@/integrations/supabase/client";

export const useAgentResultSaver = () => {
  // Save agent result changes
  const saveAgentResult = async (updatedResult: AgentResult): Promise<boolean> => {
    try {
      console.log("Saving agent result:", updatedResult);
      
      if (!updatedResult.id) {
        console.error("Cannot save result: ID is undefined");
        toast.error("Cannot save: Result ID is missing");
        return false;
      }
      
      const now = new Date().toISOString();
      
      const metadata = {
        ...(updatedResult.metadata || {}),
        manually_edited: true,
        edited_at: now
      };
      
      const { error } = await supabase
        .from('agent_results')
        .update({
          content: updatedResult.content,
          metadata: metadata
        })
        .eq('id', updatedResult.id);
      
      if (error) {
        console.error("Error updating agent result:", error);
        throw error;
      }
      
      toast.success("Briefing content updated");
      return true;
    } catch (error) {
      console.error("Error updating agent result:", error);
      toast.error("Failed to update briefing content");
      return false;
    }
  };

  return { saveAgentResult };
};
