import { create } from 'zustand';

interface ActivityState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useActivityStore = create<ActivityState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => {
    console.log('Activity store - Setting search query:', query);
    set({ searchQuery: query });
  },
}));
