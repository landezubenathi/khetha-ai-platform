import '@/i18n';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

import { AppProviders } from '@/providers/AppProviders';
import { colors } from '@/theme';

export default function RootLayout() {
  const { t } = useTranslation();
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
        <Stack.Screen name="subject-chooser" options={{ title: t('findPath') }} />
        <Stack.Screen name="assessment" options={{ title: t('interestExplorer') }} />
        <Stack.Screen name="recommendations" options={{ title: t('yourOptions') }} />
        <Stack.Screen name="practitioner" options={{ title: t('careerPractitioner') }} />
      </Stack>
    </AppProviders>
  );
}
