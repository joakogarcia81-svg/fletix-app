'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = React.useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    if (form.password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      localStorage.setItem('fletix_mock_session', JSON.stringify({
        user: { id: 'mock-user', email: form.email },
        profile: { id: 'mock-user', first_name: form.firstName, last_name: form.lastName, phone: form.phone },
        company: null,
        role: null,
      }));
      showToast('Cuenta creada (modo demo)', 'success');
      router.push('/onboarding');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
        },
      },
    });

    if (error) {
      showToast(error.message || 'Error al registrarse', 'error');
      setLoading(false);
      return;
    }

    showToast('Cuenta creada. Revisa tu email para confirmar.', 'success');
    router.push('/onboarding');
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
        <h1 className="text-xl font-black text-white tracking-tight">Crear Cuenta</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Unite a la plataforma de logística más avanzada de Argentina
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/50 backdrop-blur-xl p-8">
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
                <input type="text" required placeholder="Juan" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Apellido</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
                <input type="text" required placeholder="Pérez" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
              <input type="email" required placeholder="nombre@empresa.com" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
              <input type="tel" placeholder="11-4567-8901" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
                <input type="password" required placeholder="••••••••" value={form.password} onChange={(e) => update('password', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Confirmar</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
                <input type="password" required placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Crear Cuenta <ArrowRight className="h-4 w-4" /></>}
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-neutral-600 mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="text-white font-bold hover:underline">Iniciar sesión</Link>
      </p>
    </motion.div>
  );
}
