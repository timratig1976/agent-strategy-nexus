
-- Create canvas_history table for storing USP canvas history and snapshots
CREATE TABLE IF NOT EXISTS public.canvas_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id UUID NOT NULL,
  snapshot_data JSONB NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index on canvas_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_canvas_history_canvas_id ON public.canvas_history(canvas_id);

-- Add row level security (RLS)
ALTER TABLE public.canvas_history ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users for now
-- This can be refined later to limit access to specific users or organizations
CREATE POLICY canvas_history_all_operations
  ON public.canvas_history
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_canvas_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_canvas_history_updated_at_trigger
  BEFORE UPDATE ON public.canvas_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_canvas_history_updated_at();
