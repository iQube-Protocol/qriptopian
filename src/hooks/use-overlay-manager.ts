import { create } from 'zustand';

type OverlayType = 'portfolio' | 'intent-capture' | 'live-insights' | 'profile' | 'metavatar' | 'research' | null;

interface OverlayManagerState {
  activeOverlay: OverlayType;
  openOverlay: (overlay: OverlayType) => void;
  closeOverlay: () => void;
}

export const useOverlayManager = create<OverlayManagerState>((set) => ({
  activeOverlay: null,
  openOverlay: (overlay) => set({ activeOverlay: overlay }),
  closeOverlay: () => set({ activeOverlay: null }),
}));
