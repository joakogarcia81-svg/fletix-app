'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // Mock mode
      localStorage.setItem('fletix_mock_session', JSON.stringify({
        user: { id: 'mock-user', email },
        profile: { id: 'mock-user', first_name: 'Admin', last_name: 'Demo', phone: null },
        company: { id: 'mock-company', name: 'Demo SRL', cuit: '30-12345678-9' },
        role: 'admin',
      }));
      showToast('Sesión iniciada (modo demo)', 'success');
      router.push('/');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      showToast(error.message || 'Error al iniciar sesión', 'error');
      setLoading(false);
      return;
    }

    showToast('Sesión iniciada correctamente', 'success');
    router.push('/');
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white text-black font-black text-xl mb-4">
          F
        </div>
        <h1 className="text-xl font-black text-white tracking-tight">
          Iniciar Sesión
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Accede a tu panel de logística Fletix
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/50 backdrop-blur-xl p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              Email
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Contraseña
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] text-blue-500 hover:text-blue-400 font-semibold transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-neutral-800 bg-neutral-950/80 text-white placeholder:text-neutral-600 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Acceder <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-neutral-600 mt-6">
        ¿No tenés cuenta?{' '}
        <Link href="/register" className="text-white font-bold hover:underline">
          Crear cuenta
        </Link>
      </p>
    </motion.div>
  );
}
