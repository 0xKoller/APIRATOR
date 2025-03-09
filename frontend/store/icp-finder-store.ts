import { create } from "zustand";

type Step = "upload" | "input" | "searching" | "results";

export interface IcpProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  description: string;
  matchScore: number;
  reason: string;
}

interface IcpFinderStore {
  step: Step;
  searchQuery: string;
  csvFile: File | null;
  results: IcpProfile[];
  selectedProfile: IcpProfile | null;
  setStep: (step: Step) => void;
  setSearchQuery: (query: string) => void;
  setCsvFile: (file: File | null) => void;
  setResults: (results: IcpProfile[]) => void;
  setSelectedProfile: (profile: IcpProfile | null) => void;
  resetStore: () => void;
}

const initialState = {
  step: "upload" as Step,
  searchQuery: "",
  csvFile: null,
  results: [],
  selectedProfile: null,
};

export const useIcpFinderStore = create<IcpFinderStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCsvFile: (csvFile) => set({ csvFile }),
  setResults: (results) => set({ results }),
  setSelectedProfile: (selectedProfile) => set({ selectedProfile }),
  resetStore: () => set(initialState),
}));
