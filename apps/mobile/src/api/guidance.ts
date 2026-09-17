import { apiRequest } from '@/api/client';
import type { RecommendationResponse } from '@/types/api';

export function getRecommendations(subjectCodes: string[], interestCodes: string[]) {
  return apiRequest<RecommendationResponse>('/recommendations', {
    method: 'POST',
    body: JSON.stringify({
      subject_codes: subjectCodes,
      interest_codes: interestCodes,
      preferred_language: 'en-ZA',
    }),
  });
}

export function requestPractitioner(message: string, reason = 'career_choice') {
  return apiRequest<{ id: string; status: string }>('/practitioner-requests', {
    method: 'POST',
    body: JSON.stringify({
      reason,
      learner_message: message,
      preferred_channel: 'in_app',
    }),
  });
}

