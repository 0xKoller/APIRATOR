import { create } from "zustand";
import { z } from "zod";

type Step = "upload" | "input" | "linkedin-search" | "searching" | "results";

// Define Zod schema for targeting criteria
export const targetingCriteriaSchema = z.object({
  description: z.string().optional(),
  location: z.string().optional(),
  currentRole: z.string().optional(),
  education: z.string().optional(),
  languages: z.string().optional(),
  minFollowerCount: z.string().optional(),
  maxFollowerCount: z.string().optional(),
  skills: z.string().optional(),
  postsTopics: z.string().optional(),
  minAverageInteractionPerPostCount: z.string().optional(),
  maxAverageInteractionPerPostCount: z.string().optional(),
});

// Define Zod schema for ICP profile
export const icpProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targeting_criteria: targetingCriteriaSchema,
});

export type TargetingCriteria = z.infer<typeof targetingCriteriaSchema>;
export type IcpProfileData = z.infer<typeof icpProfileSchema>;

export interface IcpProfile {
  id: string;
  name: string;
  avatar: string;
  public_profile_url: string;
  role: string;
  description?: string;
  location?: string;
  skills?: string;
  education?: string;
  languages?: string;
  followerCount?: number;
  averageInteractionPerPostCount?: number;
  postsTopics?: string;
  matchScore: number;
  matchReason: string;
}

interface IcpFinderStore {
  step: Step;
  searchQuery: string;
  csvFile: File | null;
  linkedinUrl: string;
  results: IcpProfile[];
  selectedProfile: IcpProfile | null;
  icpCriteria: IcpProfileData;
  setStep: (step: Step) => void;
  setSearchQuery: (query: string) => void;
  setCsvFile: (file: File | null) => void;
  setLinkedinUrl: (url: string) => void;
  setResults: (results: IcpProfile[]) => void;
  setSelectedProfile: (profile: IcpProfile | null) => void;
  setIcpCriteria: (criteria: Partial<IcpProfileData>) => void;
  updateTargetingCriteria: (criteria: Partial<TargetingCriteria>) => void;
  resetStore: () => void;
}

const initialState = {
  step: "input" as Step,
  searchQuery: "",
  csvFile: null,
  linkedinUrl: "",
  results: [],
  selectedProfile: null,
  icpCriteria: {
    name: "",
    targeting_criteria: {
      description: "",
      location: "",
      currentRole: "",
      education: "",
      languages: "",
      minFollowerCount: "",
      maxFollowerCount: "",
      skills: "",
      postsTopics: "",
      minAverageInteractionPerPostCount: "",
      maxAverageInteractionPerPostCount: "",
    },
  },
};

export const useIcpFinderStore = create<IcpFinderStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setCsvFile: (csvFile) => set({ csvFile }),
  setLinkedinUrl: (linkedinUrl) => set({ linkedinUrl }),
  setResults: (results) => set({ results }),
  setSelectedProfile: (selectedProfile) => set({ selectedProfile }),
  setIcpCriteria: (criteria) =>
    set((state) => ({
      icpCriteria: { ...state.icpCriteria, ...criteria },
    })),
  updateTargetingCriteria: (criteria) =>
    set((state) => ({
      icpCriteria: {
        ...state.icpCriteria,
        targeting_criteria: {
          ...state.icpCriteria.targeting_criteria,
          ...criteria,
        },
      },
    })),
  resetStore: () => set(initialState),
}));
