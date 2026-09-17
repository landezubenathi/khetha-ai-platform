import { config } from '@/config';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

type RequestOptions = RequestInit & { authenticated?: boolean };

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');
  if (options.authenticated !== false) headers.set('X-Demo-User-ID', config.demoUserId);

  let response: Response;
  try {
    response = await fetch(`${config.apiBaseUrl}/api/v1${path}`, { ...options, headers });
  } catch {
    throw new ApiError('No connection. Your saved journey remains available offline.');
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(payload?.detail ?? 'The guidance service could not complete this request.', response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

