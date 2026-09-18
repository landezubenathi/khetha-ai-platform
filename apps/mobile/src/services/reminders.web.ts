/**
 * Expo's native scheduled-notification API is unavailable in browsers.
 * The saved journey still works on web; Android/iOS use reminders.ts.
 */
export async function scheduleJourneyReminder(_title: string) {
  return null;
}
