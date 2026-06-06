-- Módulo Financiero Schema

CREATE TABLE IF NOT EXISTS public.trip_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('adelanto', 'peaje', 'combustible', 'viatico', 'mantenimiento', 'extra')),
  amount_ars DECIMAL(12,2) NOT NULL CHECK (amount_ars >= 0),
  description TEXT,
  receipt_url TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE public.trip_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view expenses of their company"
  ON public.trip_expenses FOR SELECT
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can insert expenses for their company"
  ON public.trip_expenses FOR INSERT
  WITH CHECK (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can update expenses for their company"
  ON public.trip_expenses FOR UPDATE
  USING (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Users can delete expenses for their company"
  ON public.trip_expenses FOR DELETE
  USING (company_id IN (SELECT public.get_user_companies()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trip_expenses_trip_id ON public.trip_expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_expenses_company_id ON public.trip_expenses(company_id);
