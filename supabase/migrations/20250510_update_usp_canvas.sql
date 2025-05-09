
-- Update the usp_canvas table to use strategy_id instead of project_id
ALTER TABLE public.usp_canvas ADD COLUMN IF NOT EXISTS strategy_id UUID REFERENCES public.strategies(id);

-- For existing records, copy project_id to strategy_id if the strategy exists
UPDATE public.usp_canvas
SET strategy_id = project_id
WHERE EXISTS (SELECT 1 FROM public.strategies WHERE id = project_id);

-- Drop the foreign key constraint from project_id
ALTER TABLE public.usp_canvas DROP CONSTRAINT IF EXISTS usp_canvas_project_id_fkey;

-- Make strategy_id NOT NULL after migration is complete
ALTER TABLE public.usp_canvas ALTER COLUMN strategy_id SET NOT NULL;
