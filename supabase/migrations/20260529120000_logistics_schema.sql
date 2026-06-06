-- Fletix Multi-Tenant Logistics Schema
-- Date: 2026-05-29

-- ==============================================================================
-- 1. Helper Functions
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. Table Definitions
-- ==============================================================================

-- 2.1 Trucks (Vehículos)
CREATE TABLE public.trucks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  patent TEXT NOT NULL,
  type TEXT NOT NULL, -- Sider, Chasis, Tolva, etc.
  capacity_kg NUMERIC NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(company_id, patent)
);

-- 2.2 Drivers (Choferes)
CREATE TABLE public.drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Connect to app auth if registered
  cuit TEXT NOT NULL,
  license_number TEXT NOT NULL,
  linti_status BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'on_trip', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(company_id, cuit)
);

-- 2.3 Trips (Cargas / Viajes)
CREATE TABLE public.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  origin JSONB NOT NULL, -- { lat, lng, address, city, province }
  destination JSONB NOT NULL,
  pickup_date TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_date TIMESTAMP WITH TIME ZONE,
  cargo_type TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  price_ars NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_transit', 'delivered', 'cancelled')),
  assigned_driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  assigned_truck_id UUID REFERENCES public.trucks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2.4 Trip Events (Tracking History)
CREATE TABLE public.trip_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('pickup', 'checkpoint', 'delivery', 'issue')),
  description TEXT NOT NULL,
  location JSONB, -- { lat, lng, address }
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 Trip Applications (Postulaciones del Marketplace Interno)
CREATE TABLE public.trip_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  proposed_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(trip_id, driver_id)
);

-- 2.6 Live Locations (Realtime Tracking)
CREATE TABLE public.live_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  speed NUMERIC,
  heading NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(trip_id) -- Ensures 1:1 active location per trip
);

-- 2.7 Messages (Chat del viaje)
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2.8 Notifications (Alertas Globales)
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.9 Ratings (Calificaciones Chofer/Empresa)
CREATE TABLE public.ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ratee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(trip_id, rater_id, ratee_id)
);

-- 2.10 Documents (Remitos, Facturas, Seguros)
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('trip', 'truck', 'driver', 'company')),
  entity_id UUID NOT NULL,
  url TEXT NOT NULL,
  document_type TEXT NOT NULL, -- e.g. 'remito', 'seguro', 'licencia'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- ==============================================================================
-- 3. Triggers for updated_at
-- ==============================================================================
CREATE TRIGGER set_trucks_updated_at BEFORE UPDATE ON public.trucks FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_drivers_updated_at BEFORE UPDATE ON public.drivers FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_trip_applications_updated_at BEFORE UPDATE ON public.trip_applications FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER set_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ==============================================================================
-- 4. Indexes (Performance & Foreign Keys)
-- ==============================================================================
CREATE INDEX idx_trucks_company_id ON public.trucks(company_id);
CREATE INDEX idx_drivers_company_id ON public.drivers(company_id);
CREATE INDEX idx_trips_company_id ON public.trips(company_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trips_driver ON public.trips(assigned_driver_id);
CREATE INDEX idx_trip_events_trip_id ON public.trip_events(trip_id);
CREATE INDEX idx_trip_apps_trip_id ON public.trip_applications(trip_id);
CREATE INDEX idx_live_locs_trip_id ON public.live_locations(trip_id);
CREATE INDEX idx_messages_trip_id ON public.messages(trip_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_ratings_trip_id ON public.ratings(trip_id);
CREATE INDEX idx_documents_entity ON public.documents(entity_type, entity_id);

-- ==============================================================================
-- 5. Row Level Security (RLS) Configuration
-- ==============================================================================
-- Enable RLS
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Shared Policy Template Macro: (company_id IN (SELECT public.get_user_companies())) AND deleted_at IS NULL
-- To keep it performant, we define standard SELECT/INSERT/UPDATE/DELETE policies for each.

-- 5.1 Trucks
CREATE POLICY "Tenant isolation for trucks select" ON public.trucks FOR SELECT USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);
CREATE POLICY "Tenant isolation for trucks insert" ON public.trucks FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for trucks update" ON public.trucks FOR UPDATE USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);
CREATE POLICY "Tenant isolation for trucks delete" ON public.trucks FOR DELETE USING (company_id IN (SELECT public.get_user_companies()));

-- 5.2 Drivers
CREATE POLICY "Tenant isolation for drivers select" ON public.drivers FOR SELECT USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);
CREATE POLICY "Tenant isolation for drivers insert" ON public.drivers FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for drivers update" ON public.drivers FOR UPDATE USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);
CREATE POLICY "Tenant isolation for drivers delete" ON public.drivers FOR DELETE USING (company_id IN (SELECT public.get_user_companies()));

-- 5.3 Trips
CREATE POLICY "Tenant isolation for trips select" ON public.trips FOR SELECT USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);
CREATE POLICY "Tenant isolation for trips insert" ON public.trips FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for trips update" ON public.trips FOR UPDATE USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);
CREATE POLICY "Tenant isolation for trips delete" ON public.trips FOR DELETE USING (company_id IN (SELECT public.get_user_companies()));

-- 5.4 Trip Events
CREATE POLICY "Tenant isolation for trip_events select" ON public.trip_events FOR SELECT USING (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for trip_events insert" ON public.trip_events FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));

-- 5.5 Trip Applications
CREATE POLICY "Tenant isolation for trip_apps select" ON public.trip_applications FOR SELECT USING (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for trip_apps insert" ON public.trip_applications FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for trip_apps update" ON public.trip_applications FOR UPDATE USING (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for trip_apps delete" ON public.trip_applications FOR DELETE USING (company_id IN (SELECT public.get_user_companies()));

-- 5.6 Live Locations
CREATE POLICY "Tenant isolation for live_locations select" ON public.live_locations FOR SELECT USING (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for live_locations insert" ON public.live_locations FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for live_locations update" ON public.live_locations FOR UPDATE USING (company_id IN (SELECT public.get_user_companies()));

-- 5.7 Messages
CREATE POLICY "Tenant isolation for messages select" ON public.messages FOR SELECT USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);
CREATE POLICY "Tenant isolation for messages insert" ON public.messages FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for messages delete" ON public.messages FOR DELETE USING (sender_id = auth.uid()); -- Only sender can delete

-- 5.8 Notifications
CREATE POLICY "Users can only view their own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can only update their own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
-- System usually inserts notifications (backend), but allowing admins to insert for testing
CREATE POLICY "Tenant isolation for notifications insert" ON public.notifications FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));

-- 5.9 Ratings
CREATE POLICY "Tenant isolation for ratings select" ON public.ratings FOR SELECT USING (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for ratings insert" ON public.ratings FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));

-- 5.10 Documents
CREATE POLICY "Tenant isolation for documents select" ON public.documents FOR SELECT USING (company_id IN (SELECT public.get_user_companies()) AND deleted_at IS NULL);
CREATE POLICY "Tenant isolation for documents insert" ON public.documents FOR INSERT WITH CHECK (company_id IN (SELECT public.get_user_companies()));
CREATE POLICY "Tenant isolation for documents delete" ON public.documents FOR DELETE USING (company_id IN (SELECT public.get_user_companies()));

-- ==============================================================================
-- 6. Supabase Realtime Configurations
-- ==============================================================================
-- Add tables to the realtime publication (Supabase requires this for subscriptions)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE 
    public.live_locations, 
    public.messages, 
    public.trip_events,
    public.notifications;
COMMIT;

-- ==============================================================================
-- 7. Dummy Seed Data (Optional for testing)
-- ==============================================================================
-- Note: Replace the UUID below with a valid company_id from your DB.
/*
DO $$ 
DECLARE
  comp_id UUID := '11111111-1111-1111-1111-111111111111'; -- replace this
  driver_id UUID;
  truck_id UUID;
  trip_id UUID;
BEGIN
  -- Insert Driver
  INSERT INTO public.drivers (company_id, cuit, license_number, linti_status, status)
  VALUES (comp_id, '20-12345678-9', 'LIC-987654321', true, 'available')
  RETURNING id INTO driver_id;

  -- Insert Truck
  INSERT INTO public.trucks (company_id, patent, type, capacity_kg, status)
  VALUES (comp_id, 'AA123BB', 'Sider', 28000, 'active')
  RETURNING id INTO truck_id;

  -- Insert Trip
  INSERT INTO public.trips (
    company_id, origin, destination, pickup_date, cargo_type, weight_kg, price_ars, status, assigned_driver_id, assigned_truck_id
  ) VALUES (
    comp_id, 
    '{"address": "Av. Corrientes 1234", "city": "Buenos Aires"}', 
    '{"address": "San Martín 456", "city": "Rosario"}', 
    timezone('utc'::text, now() + interval '1 day'),
    'Pallets Generales',
    15000,
    850000.00,
    'assigned',
    driver_id,
    truck_id
  ) RETURNING id INTO trip_id;

  -- Insert Trip Event
  INSERT INTO public.trip_events (company_id, trip_id, event_type, description)
  VALUES (comp_id, trip_id, 'checkpoint', 'Carga lista para retiro');
END $$;
*/
