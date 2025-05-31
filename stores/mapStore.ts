import { create } from 'zustand';
import { KelurahanRisk } from '~/types/kelurahan';

interface MapStore {
  selectedKelurahan: KelurahanRisk | null;
  isBottomSheetOpen: boolean;
  openBottomSheet: (kelurahan: KelurahanRisk) => void;
  closeBottomSheet: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedKelurahan: null,
  isBottomSheetOpen: false,
  openBottomSheet: (kelurahan) =>
    set({
      selectedKelurahan: kelurahan,
      isBottomSheetOpen: true,
    }),
  closeBottomSheet: () =>
    set({
      selectedKelurahan: null,
      isBottomSheetOpen: false,
    }),
}));
