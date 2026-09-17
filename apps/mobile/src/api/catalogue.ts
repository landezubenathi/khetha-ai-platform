import { apiRequest } from '@/api/client';
import { loadCatalogueWithCache } from '@/db/catalogueCache';
import type { Career, Interest, Subject } from '@/types/api';

export const getSubjects = () =>
  loadCatalogueWithCache('subjects', () =>
    apiRequest<Subject[]>('/catalog/subjects', { authenticated: false }),
  );
export const getInterests = () =>
  loadCatalogueWithCache('interests', () =>
    apiRequest<Interest[]>('/catalog/interests', { authenticated: false }),
  );
export const getCareers = (query = '') =>
  loadCatalogueWithCache(`careers:${query}`, () =>
    apiRequest<Career[]>(`/catalog/careers${query ? `?query=${encodeURIComponent(query)}` : ''}`, {
      authenticated: false,
    }),
  );
