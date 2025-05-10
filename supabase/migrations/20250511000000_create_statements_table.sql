
-- Create the strategy_statements table
CREATE TABLE IF NOT EXISTS strategy_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  impact TEXT CHECK (impact IN ('low', 'medium', 'high')),
  is_ai_generated BOOLEAN DEFAULT false,
  statement_type TEXT CHECK (statement_type IN ('pain', 'gain')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_strategy_statements_strategy_id ON strategy_statements(strategy_id);
CREATE INDEX IF NOT EXISTS idx_strategy_statements_type ON strategy_statements(statement_type);

-- Add RLS policy
ALTER TABLE strategy_statements ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view their own strategy statements"
  ON strategy_statements FOR SELECT
  USING (
    strategy_id IN (
      SELECT id FROM strategies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own strategy statements"
  ON strategy_statements FOR INSERT
  WITH CHECK (
    strategy_id IN (
      SELECT id FROM strategies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own strategy statements"
  ON strategy_statements FOR UPDATE
  USING (
    strategy_id IN (
      SELECT id FROM strategies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own strategy statements"
  ON strategy_statements FOR DELETE
  USING (
    strategy_id IN (
      SELECT id FROM strategies WHERE user_id = auth.uid()
    )
  );
