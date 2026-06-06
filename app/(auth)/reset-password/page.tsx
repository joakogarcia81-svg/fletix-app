'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      showToast('Contraseña actualizada (modo demo)', 'success');
      router.push('/login');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      showToast(error.message || 'Error al actualizar contraseña', 'error');
      setLoading(false);
      return;
    }

    showToast('Contraseña actualizada correctamente', 'success');
    router.push('/');
  };

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950/80 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 outline-none transition-all';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-black font-black text-xl mb-4">
          F
        </div>
        <h1 className="text-xl font-black text-white tracking-tight">
          Nueva Contraseña
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Elegí una contraseña segura para tu cuenta
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/50 backdrop-blur-xl p-8">
        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Nueva Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
              <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
              <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-neutral-800/30 border border-neutral-800/40 text-[10px] text-neutral-500">
            <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
            Mínimo 6 caracteres. Recomendamos combinar letras, números y símbolos.
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
