import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fletix – Acceso',
  description: 'Iniciar sesión, registrarse o recuperar contraseña en Fletix.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[400px] h-[400px] bg-red-600/8 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[250px] h-[250px] bg-neutral-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}
