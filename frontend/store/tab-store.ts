import { create } from "zustand";

type Tab = "person" | "icp";

interface TabStore {
  selectedTab: Tab;
  setSelectedTab: (tab: Tab) => void;
}

export const useTabStore = create<TabStore>((set) => ({
  selectedTab: "person",
  setSelectedTab: (selectedTab) => set({ selectedTab }),
}));
