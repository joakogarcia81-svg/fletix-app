import { LayoutDashboard, Truck, Users, TrendingUp, FileText, Globe, MapPin } from 'lucide-react';
import type { DashboardView } from '@/store/use-ui-store';

// ─── App Metadata ───────────────────────────────────────────
export const APP_NAME = 'Fletix';
export const APP_DESCRIPTION = 'Logística y Transporte de Cargas Argentina';
export const APP_VERSION = '0.1.0';

// ─── Navigation ─────────────────────────────────────────────
export interface NavItem {
  id: DashboardView;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'resumen', label: 'Panel de Resumen', shortLabel: 'Resumen', icon: LayoutDashboard },
  { id: 'marketplace', label: 'Mercado de Cargas', shortLabel: 'Mercado', icon: Globe },
  { id: 'tracking', label: 'Tracking en Vivo', shortLabel: 'Tracking', icon: MapPin },
  { id: 'cargas', label: 'Administrador de Cargas', shortLabel: 'Cargas', icon: Truck },
  { id: 'choferes', label: 'Gestión de Choferes', shortLabel: 'Choferes', icon: Users },
  { id: 'vehiculos', label: 'Control de Flota', shortLabel: 'Flota', icon: TrendingUp },
  { id: 'reportes', label: 'Reportes Estadísticos', shortLabel: 'Reportes', icon: FileText },
];

// ─── Breakpoints ────────────────────────────────────────────
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

// ─── Sidebar ────────────────────────────────────────────────
export const SIDEBAR_WIDTH_OPEN = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

// ─── API ────────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
