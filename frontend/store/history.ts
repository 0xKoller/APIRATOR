import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchResult {
  id: string;
  query: string;
  timestamp: number;
  type: "person" | "icp";
  result: any; // Replace with proper type based on your API response
  targetPerson?: {
    name: string;
    company: string;
    avatar: string;
  };
}

interface HistoryState {
  searches: SearchResult[];
  selectedSearch: SearchResult | null;
  addSearch: (search: Omit<SearchResult, "id" | "timestamp">) => void;
  clearHistory: () => void;
  removeSearch: (id: string) => void;
  selectSearch: (id: string) => void;
  clearSelectedSearch: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      searches: [],
      selectedSearch: null,
      addSearch: (search) =>
        set((state) => ({
          searches: [
            {
              ...search,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
            ...state.searches,
          ].slice(0, 50), // Keep only last 50 searches
        })),
      clearHistory: () => set({ searches: [], selectedSearch: null }),
      removeSearch: (id) =>
        set((state) => ({
          searches: state.searches.filter((search) => search.id !== id),
          selectedSearch:
            state.selectedSearch?.id === id ? null : state.selectedSearch,
        })),
      selectSearch: (id) =>
        set((state) => ({
          selectedSearch:
            state.searches.find((search) => search.id === id) || null,
        })),
      clearSelectedSearch: () => set({ selectedSearch: null }),
    }),
    {
      name: "search-history",
    }
  )
);
