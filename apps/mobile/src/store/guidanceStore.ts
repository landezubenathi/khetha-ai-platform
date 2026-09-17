import { create } from 'zustand';

import type { RecommendationResponse } from '@/types/api';

type GuidanceState = {
  subjectCodes: string[];
  interestCodes: string[];
  response: RecommendationResponse | null;
  setSubjectCodes: (codes: string[]) => void;
  setInterestCodes: (codes: string[]) => void;
  setResponse: (response: RecommendationResponse) => void;
  reset: () => void;
};

export const useGuidanceStore = create<GuidanceState>((set) => ({
  subjectCodes: [],
  interestCodes: [],
  response: null,
  setSubjectCodes: (subjectCodes) => set({ subjectCodes }),
  setInterestCodes: (interestCodes) => set({ interestCodes }),
  setResponse: (response) => set({ response }),
  reset: () => set({ subjectCodes: [], interestCodes: [], response: null }),
}));

