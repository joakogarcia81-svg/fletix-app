-- Performance Audit: Compound Indexes for Supabase Optimization

-- For Dashboard & Loads: Filters frequently by company and status simultaneously.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trips_company_status ON public.trips(company_id, status);

-- For Analytics & Matching Engine: Filters frequently by company and date.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trips_company_date ON public.trips(company_id, pickup_date);

-- For Fleet Management: Filters trucks by company and their operational state.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_trucks_company_opstatus ON public.trucks(company_id, operational_status);
