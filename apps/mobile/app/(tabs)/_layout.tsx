import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { colors } from '@/theme';

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.navy,
        headerTitleStyle: { fontWeight: '800' },
        tabBarActiveTintColor: colors.teal,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('home') }} />
      <Tabs.Screen name="journey" options={{ title: t('journey') }} />
      <Tabs.Screen name="directory" options={{ title: t('explore') }} />
      <Tabs.Screen name="profile" options={{ title: t('profile') }} />
    </Tabs>
  );
}
