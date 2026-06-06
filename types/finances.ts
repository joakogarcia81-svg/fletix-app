export type ExpenseCategory = 'adelanto' | 'peaje' | 'combustible' | 'viatico' | 'mantenimiento' | 'extra';

export interface TripExpense {
  id: string;
  trip_id: string;
  company_id: string;
  category: ExpenseCategory;
  amount_ars: number;
  description: string | null;
  receipt_url: string | null;
  created_by: string | null;
  created_at: string;
}

export interface TripFinancialSummary {
  trip_id: string;
  revenue: number; // Tarifa pactada
  total_expenses: number;
  gross_margin: number; // Revenue - Expenses
  net_margin_percentage: number; // (Gross Margin / Revenue) * 100
  expenses_by_category: Record<ExpenseCategory, number>;
}
