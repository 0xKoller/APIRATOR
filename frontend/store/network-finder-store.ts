import { create } from "zustand";

type Step = "upload" | "input" | "searching" | "results";

interface LinkedInInteraction {
  interactions: {
    action: string;
    appreciationCount: number;
    author: {
      firstName: string;
      lastName: string;
      headline: string;
      url: string;
      username: string;
    };
    comment: {
      text: string;
      commentsCount: number;
    };
    empathyCount: number;
    entityType: string;
    likeCount: number;
    postUrl?: string;
    postedAt: string;
    postedDate: string;
    praiseCount: number;
    repostsCount: number;
    shareUrn: string;
    text: string;
    totalReactionCount: number;
    urn: string;
    interactionCount: number;
  }[];
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  interactionCount: number;
  lastInteraction: string;
  connectionStrength: number;
  reason: string;
  mutualConnections: number;
  recentActivity: string;
  recentInteractions: LinkedInInteraction[];
}

interface TargetPerson {
  name: string;
  company: string;
  avatar: string;
}

interface NetworkFinderStore {
  step: Step;
  url: string;
  csvFile: File | null;
  targetPerson: TargetPerson;
  results: Contact[];
  showIntroModal: boolean;
  selectedContact: Contact | null;
  introMessage: string;
  setStep: (step: Step) => void;
  setUrl: (url: string) => void;
  setCsvFile: (file: File | null) => void;
  setTargetPerson: (person: TargetPerson) => void;
  setResults: (results: Contact[]) => void;
  setShowIntroModal: (show: boolean) => void;
  setSelectedContact: (contact: Contact | null) => void;
  setIntroMessage: (message: string) => void;
  resetStore: () => void;
}

const initialState = {
  step: "input" as Step,
  url: "",
  csvFile: null,
  targetPerson: {
    name: "",
    company: "",
    avatar: "",
  },
  results: [],
  showIntroModal: false,
  selectedContact: null,
  introMessage: "",
};

export const useNetworkFinderStore = create<NetworkFinderStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setUrl: (url) => set({ url }),
  setCsvFile: (csvFile) => set({ csvFile }),
  setTargetPerson: (targetPerson) => set({ targetPerson }),
  setResults: (results) => set({ results }),
  setShowIntroModal: (showIntroModal) => set({ showIntroModal }),
  setSelectedContact: (selectedContact) => set({ selectedContact }),
  setIntroMessage: (introMessage) => set({ introMessage }),
  resetStore: () => set(initialState),
}));

export type { Contact, LinkedInInteraction };
