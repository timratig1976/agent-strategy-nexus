
-- Create strategy_metadata table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.strategy_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  strategy_id UUID NOT NULL REFERENCES public.strategies(id) ON DELETE CASCADE,
  company_name TEXT,
  website_url TEXT,
  product_description TEXT,
  product_url TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add unique constraint for strategy_id
ALTER TABLE public.strategy_metadata ADD CONSTRAINT unique_strategy_metadata_strategy_id UNIQUE (strategy_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_strategy_metadata_strategy_id ON public.strategy_metadata(strategy_id);
