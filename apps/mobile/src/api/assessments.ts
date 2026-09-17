import { apiRequest } from '@/api/client';
import type { Assessment, AssessmentAttemptResult } from '@/types/api';

export const getInterestExplorer = () =>
  apiRequest<Assessment>('/assessments/demo-interest-explorer', { authenticated: false });

export const submitInterestExplorer = (
  clientEventId: string,
  answers: { question_id: string; option_id: string }[],
) =>
  apiRequest<AssessmentAttemptResult>('/assessments/demo-interest-explorer/attempts', {
    method: 'POST',
    body: JSON.stringify({ client_event_id: clientEventId, answers }),
  });
