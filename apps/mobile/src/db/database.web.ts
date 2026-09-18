/**
 * The browser uses localStorage through the web-specific repositories.
 * PostgreSQL remains behind the FastAPI service; expo-sqlite is native-only.
 */
export async function initialiseDatabase() {
  return undefined;
}

export async function getDatabase(): Promise<never> {
  throw new Error('The SQLite database is only available in the native mobile app.');
}
