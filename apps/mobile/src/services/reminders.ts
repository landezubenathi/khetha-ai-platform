import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function scheduleJourneyReminder(title: string) {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('journey-reminders', {
      name: 'Career journey reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const permissions = await Notifications.requestPermissionsAsync();
  if (permissions.status !== 'granted') return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Continue your career journey',
      body: `Review your saved path: ${title}`,
      data: { url: '/(tabs)/journey' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24,
    },
  });
}

