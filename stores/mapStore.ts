import { create } from 'zustand';

interface KelurahanRisk {
  id: string;
  latitude: number;
  longitude: number;
  kelurahan: string;
  kecamatan: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  issues: string[];
}

interface MapState {
  selectedKelurahan: KelurahanRisk | null;
  isBottomSheetOpen: boolean;
  setSelectedKelurahan: (kelurahan: KelurahanRisk | null) => void;
  openBottomSheet: (kelurahan: KelurahanRisk) => void;
  closeBottomSheet: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedKelurahan: null,
  isBottomSheetOpen: false,
  setSelectedKelurahan: (kelurahan) => set({ selectedKelurahan: kelurahan }),
  openBottomSheet: (kelurahan) => {
    console.log('Opening bottom sheet for:', kelurahan.kelurahan);
    set({ selectedKelurahan: kelurahan, isBottomSheetOpen: true });
  },
  closeBottomSheet: () => {
    console.log('Closing bottom sheet');
    set({ selectedKelurahan: null, isBottomSheetOpen: false });
  },
}));
