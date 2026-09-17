import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { listJourneyItems } from '@/db/journeyRepository';
import { syncPendingJourney } from '@/db/syncService';
import { colors, spacing } from '@/theme';
import type { JourneyItem } from '@/types/api';

export default function JourneyScreen() {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [message, setMessage] = useState('Saved locally');

  const load = useCallback(async () => {
    setItems(await listJourneyItems());
    const result = await syncPendingJourney();
    setMessage(result.offline ? 'Offline · saved on this device' : `${result.synced} change(s) synchronised`);
  }, []);
  useFocusEffect(useCallback(() => { void load(); }, [load]));

  return (
    <Screen>
      <Text style={styles.status}>{message}</Text>
      {!items.length ? (
        <Text style={styles.empty}>No saved careers yet. Use Find my path to begin your journey.</Text>
      ) : items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.status} · Available offline</Text>
        </View>
      ))}
      <Pressable onPress={load} style={styles.button}>
        <Text style={styles.buttonText}>Synchronise now</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  status: { color: colors.tealDark, fontSize: 14, fontWeight: '700' },
  empty: { color: colors.muted, fontSize: 16, lineHeight: 24 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, gap: spacing.xs, padding: spacing.lg },
  title: { color: colors.navy, fontSize: 20, fontWeight: '800' },
  meta: { color: colors.muted, fontSize: 14 },
  button: { alignItems: 'center', borderColor: colors.teal, borderRadius: 13, borderWidth: 1, minHeight: 48, justifyContent: 'center' },
  buttonText: { color: colors.tealDark, fontWeight: '800' },
});

