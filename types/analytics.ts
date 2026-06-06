export interface AnalyticsKPIs {
  total_trips: number;
  total_revenue: number;
  total_expenses: number;
  net_margin: number;
  total_km: number;
  active_trucks: number;
  total_trucks: number;
  published_loads: number;
  taken_loads: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  trips: number;
}

export interface ProvinceData {
  province: string;
  trips: number;
}

export interface AnalyticsData {
  kpis: AnalyticsKPIs;
  monthlyTrend: MonthlyData[];
  provinceDistribution: ProvinceData[];
  recentTrips: any[]; // We'll use a generic type here for the table data
}
