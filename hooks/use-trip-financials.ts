'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TripExpense, ExpenseCategory, TripFinancialSummary } from '@/types/finances';
import { useToast } from '@/components/ui/toast';

// Use a mock to avoid crashes if table doesn't exist yet, but structure it for real DB
export function useTripFinancials(tripId: string, basePriceArs: number) {
  const [expenses, setExpenses] = useState<TripExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const { showToast } = useToast();

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('trip_expenses')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setExpenses(data as TripExpense[]);
    }
    setIsLoading(false);
  }, [tripId, supabase]);

  useEffect(() => {
    if (tripId) {
      fetchExpenses();
    }
  }, [tripId, fetchExpenses]);

  const addExpense = async (category: ExpenseCategory, amount: number, description?: string) => {
    // 1. Get current user's company (for insertion)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast('Error de autenticación', 'error');
      return false;
    }

    // Usually company_id comes from context or a user profile query
    const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
    
    // For MVP, we mock if profile doesn't have it, but we should use real data
    const companyId = profile?.company_id || '00000000-0000-0000-0000-000000000000';

    const newExpense = {
      trip_id: tripId,
      company_id: companyId,
      category,
      amount_ars: amount,
      description: description || null,
      created_by: user.id
    };

    const { data, error } = await supabase.from('trip_expenses').insert(newExpense).select().single();

    if (error) {
      // Fallback for demo if DB isn't pushed yet
      console.warn("Table might not exist yet, mocking insertion", error);
      const mockExpense: TripExpense = {
        id: Math.random().toString(),
        trip_id: tripId,
        company_id: companyId,
        category,
        amount_ars: amount,
        description: description || null,
        created_by: user.id,
        created_at: new Date().toISOString(),
        receipt_url: null
      };
      setExpenses(prev => [mockExpense, ...prev]);
      showToast('Gasto agregado (Mock Mode)', 'success');
      return true;
    }

    if (data) {
      setExpenses(prev => [data as TripExpense, ...prev]);
      showToast('Gasto registrado correctamente', 'success');
      return true;
    }

    return false;
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('trip_expenses').delete().eq('id', id);
    if (error) {
      // Demo fallback
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast('Gasto eliminado (Mock Mode)', 'success');
    } else {
      setExpenses(prev => prev.filter(e => e.id !== id));
      showToast('Gasto eliminado', 'success');
    }
  };

  const summary = useMemo<TripFinancialSummary>(() => {
    const total_expenses = expenses.reduce((sum, exp) => sum + Number(exp.amount_ars), 0);
    const gross_margin = basePriceArs - total_expenses;
    const net_margin_percentage = basePriceArs > 0 ? (gross_margin / basePriceArs) * 100 : 0;

    const expenses_by_category = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount_ars);
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return {
      trip_id: tripId,
      revenue: basePriceArs,
      total_expenses,
      gross_margin,
      net_margin_percentage,
      expenses_by_category
    };
  }, [expenses, tripId, basePriceArs]);

  return { expenses, isLoading, summary, addExpense, deleteExpense };
}
