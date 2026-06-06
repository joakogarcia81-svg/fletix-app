'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, FileText, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/components/providers/auth-provider';

export default function OnboardingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [name, setName] = React.useState('');
  const [cuit, setCuit] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !cuit) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    setLoading(true);

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock mode
      const sessionStr = localStorage.getItem('fletix_mock_session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        session.company = { id: 'mock-company', name, cuit };
        session.role = 'admin';
        localStorage.setItem('fletix_mock_session', JSON.stringify(session));
      }
      showToast('Empresa registrada correctamente', 'success');
      router.push('/');
      router.refresh();
      return;
    }

    if (!user) {
      showToast('Sesión no encontrada', 'error');
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // 1. Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({ name, cuit })
      .select()
      .single();

    if (companyError || !company) {
      showToast(companyError?.message || 'Error al crear empresa', 'error');
      setLoading(false);
      return;
    }

    // 2. Create membership
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        company_id: company.id,
        user_id: user.id,
        role: 'admin',
      });

    if (membershipError) {
      showToast(membershipError.message || 'Error al crear membresía', 'error');
      setLoading(false);
      return;
    }

    showToast('¡Empresa configurada exitosamente!', 'success');
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-black font-black text-xl mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            Crear tu Empresa
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Configurá tu cuenta para empezar a operar en Fletix
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/50 backdrop-blur-xl p-8">
          <form onSubmit={handleCreateCompany} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Razón Social / Nombre de Fantasía
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Transportes Demo SRL"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950/80 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                CUIT
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
                <input
                  type="text"
                  value={cuit}
                  onChange={(e) => setCuit(e.target.value)}
                  required
                  placeholder="30-12345678-9"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950/80 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Comenzar a operar <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
