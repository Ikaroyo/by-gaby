-- Add cost fields to quotes table
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS base_cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_cost numeric DEFAULT 0;

-- Add cost fields to quote_recipes table
ALTER TABLE public.quote_recipes 
ADD COLUMN IF NOT EXISTS unit_cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_cost numeric DEFAULT 0;
