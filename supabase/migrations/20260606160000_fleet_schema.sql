-- Fleet Management Schema Upgrade
-- Expands the trucks table to support rich operational data

ALTER TABLE public.trucks
  ADD COLUMN IF NOT EXISTS brand TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS year INTEGER,
  ADD COLUMN IF NOT EXISTS operational_status TEXT DEFAULT 'disponible' CHECK (operational_status IN ('disponible', 'ocupado', 'mantenimiento', 'fuera de servicio', 'reservado')),
  ADD COLUMN IF NOT EXISTS default_driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL;

-- Create an index to quickly find trucks by operational status
CREATE INDEX IF NOT EXISTS idx_trucks_operational_status ON public.trucks(operational_status);
