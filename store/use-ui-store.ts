import { create } from 'zustand';

export type DashboardView = 'resumen' | 'cargas' | 'choferes' | 'vehiculos' | 'reportes' | 'marketplace' | 'tracking';

interface UiState {
  sidebarOpen: boolean;
  activeView: DashboardView;
  mobileDrawerOpen: boolean;
  searchQuery: string;
  selectedCargoId: string | null;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: DashboardView) => void;
  toggleMobileDrawer: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCargoId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  activeView: 'resumen',
  mobileDrawerOpen: false,
  searchQuery: '',
  selectedCargoId: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveView: (view) => set({ activeView: view, mobileDrawerOpen: false }),
  toggleMobileDrawer: () => set((state) => ({ mobileDrawerOpen: !state.mobileDrawerOpen })),
  setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCargoId: (id) => set({ selectedCargoId: id }),
}));
