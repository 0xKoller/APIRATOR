import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LinkedInProfileState {
  linkedinUrl: string | null;
  linkedinId: string | null;
  unipileAccountId: string | null;
  isAuthenticated: boolean;
  setLinkedinUrl: (url: string) => void;
  setLinkedinId: (id: string | null) => void;
  setUnipileAccountId: (id: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  reset: () => void;
}

export const useLinkedinProfileStore = create<LinkedInProfileState>()(
  persist(
    (set) => ({
      linkedinUrl: null,
      linkedinId: null,
      unipileAccountId: null,
      isAuthenticated: false,
      setLinkedinUrl: (url) => set({ linkedinUrl: url }),
      setLinkedinId: (id) => set({ linkedinId: id }),
      setUnipileAccountId: (id) => set({ unipileAccountId: id }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      reset: () =>
        set({
          linkedinUrl: null,
          linkedinId: null,
          unipileAccountId: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "linkedin-profile",
    }
  )
);
