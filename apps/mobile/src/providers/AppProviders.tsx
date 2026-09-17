import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

import { initialiseDatabase } from '@/db/database';
import { syncPendingJourney } from '@/db/syncService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 5 * 60 * 1000 },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    initialiseDatabase().then(() => syncPendingJourney()).catch(console.error);
  }, []);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

