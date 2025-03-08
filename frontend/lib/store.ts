import { create } from "zustand";
import { StagehandResponse } from "./types";

interface ApiFormData {
  url: string;
  prompt: string;
  stagehandSteps?: StagehandResponse;
}

interface ApiState {
  step: number;
  formData: ApiFormData;
  endpointData: any | null;
  setStep: (step: number) => void;
  setFormData: (data: ApiFormData) => void;
  setEndpointData: (data: any) => void;
  reset: () => void;
}

export const useApiStore = create<ApiState>((set) => ({
  step: 1,
  formData: {
    url: "",
    prompt: "",
  },
  endpointData: null,
  setStep: (step) => set({ step }),
  setFormData: (formData) => set({ formData }),
  setEndpointData: (endpointData) => set({ endpointData }),
  reset: () =>
    set({
      step: 1,
      formData: {
        url: "",
        prompt: "",
      },
      endpointData: null,
    }),
}));
