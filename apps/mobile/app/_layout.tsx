import '@/i18n';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '@/providers/AppProviders';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.navy,
          headerTitleStyle: { fontWeight: '800' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="subject-chooser" options={{ title: 'Find my path' }} />
        <Stack.Screen name="assessment" options={{ title: 'Interest explorer' }} />
        <Stack.Screen name="recommendations" options={{ title: 'Your options' }} />
        <Stack.Screen name="practitioner" options={{ title: 'Career practitioner' }} />
      </Stack>
    </AppProviders>
  );
}
