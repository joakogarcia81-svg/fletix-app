-- CRM Module: Clients / Dadores de Carga
-- Multi-tenant client management

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,          -- Razón social
  cuit TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  location JSONB,                       -- { address, city, province, lat, lng }
  industry TEXT,                        -- Rubro (Alimentos, Construcción, etc.)
  notes TEXT,                           -- Observaciones internas
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(company_id, cuit)
);

-- Add client_id FK to trips so we can track which client each trip belongs to
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation for clients select"
  ON public.clients FOR SELECT
  USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);

CREATE POLICY "Tenant isolation for clients insert"
  ON public.clients FOR INSERT
  WITH CHECK (company_id IN (SELECT public.get_user_companies()));

CREATE POLICY "Tenant isolation for clients update"
  ON public.clients FOR UPDATE
  USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);

CREATE POLICY "Tenant isolation for clients delete"
  ON public.clients FOR DELETE
  USING (company_id IN (SELECT public.get_user_companies()));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON public.clients(company_id);
CREATE INDEX IF NOT EXISTS idx_clients_cuit ON public.clients(cuit);
CREATE INDEX IF NOT EXISTS idx_trips_client_id ON public.trips(client_id);

-- Trigger for updated_at
CREATE TRIGGER set_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
