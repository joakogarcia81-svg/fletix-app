'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      showToast('Email de recuperación enviado (modo demo)', 'success');
      setSent(true);
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      showToast(error.message || 'Error al enviar email', 'error');
    } else {
      showToast('Te enviamos un email con instrucciones', 'success');
      setSent(true);
    }
    setLoading(false);
  };

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
          Recuperar Contraseña
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Ingresá tu email y te enviaremos un enlace de recuperación
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/50 backdrop-blur-xl p-8">
        {sent ? (
          <div className="text-center py-4 space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto">
              <Send className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-sm text-neutral-300 font-semibold">Email enviado</p>
            <p className="text-xs text-neutral-500">
              Revisá tu bandeja de entrada en <span className="text-white font-bold">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Email de la cuenta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nombre@empresa.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950/80 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar enlace'}
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-xs text-neutral-600 mt-6">
        <Link href="/login" className="text-white font-bold hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Volver al login
        </Link>
      </p>
    </motion.div>
  );
}
