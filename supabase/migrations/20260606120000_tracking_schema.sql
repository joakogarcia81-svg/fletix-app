-- Create live_locations table for real-time tracking
CREATE TABLE IF NOT EXISTS public.live_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed DOUBLE PRECISION,
  heading DOUBLE PRECISION,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_live_locations_trip_id ON public.live_locations(trip_id);
CREATE INDEX IF NOT EXISTS idx_live_locations_company_id ON public.live_locations(company_id);

-- Enable RLS
ALTER TABLE public.live_locations ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view live_locations of their company"
  ON public.live_locations
  FOR SELECT
  USING (
    company_id IN (SELECT public.get_user_companies())
  );

CREATE POLICY "Drivers can insert their own live_locations"
  ON public.live_locations
  FOR INSERT
  WITH CHECK (
    driver_id = auth.uid()
  );

CREATE POLICY "Drivers can update their own live_locations"
  ON public.live_locations
  FOR UPDATE
  USING (
    driver_id = auth.uid()
  );

-- Enable Realtime replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_locations;
