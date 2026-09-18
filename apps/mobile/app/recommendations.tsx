import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { saveJourneyItem } from '@/db/journeyRepository';
import { scheduleJourneyReminder } from '@/services/reminders';
import { useGuidanceStore } from '@/store/guidanceStore';
import { colors, spacing } from '@/theme';
import type { RecommendationResult } from '@/types/api';

export default function RecommendationsScreen() {
  const response = useGuidanceStore((state) => state.response);
  if (!response) {
    return (
      <Screen>
        <Text style={styles.heading}>No results yet</Text>
        <Pressable style={styles.primaryButton} onPress={() => router.replace('/subject-chooser')}>
          <Text style={styles.primaryText}>Choose subjects and interests</Text>
        </Pressable>
      </Screen>
    );
  }

  async function save(result: RecommendationResult) {
    const item = {
      id: Crypto.randomUUID(),
      item_type: 'career' as const,
      reference_id: result.career.id,
      title: result.career.name,
      status: 'saved' as const,
      notes: null,
      target_date: null,
      source_snapshot: {
        score: result.score,
        reasons: result.reasons,
        content_version: result.career.source.version_label,
        is_official: result.career.source.is_official,
      },
      client_updated_at: new Date().toISOString(),
    };
    await saveJourneyItem(item);
    try {
      await scheduleJourneyReminder(result.career.name);
    } catch {
      // Saving the journey must still succeed if notification permission or
      // scheduling is unavailable on the current device.
    }
    router.push('/(tabs)/journey');
  }

  return (
    <Screen>
      <View style={styles.notice}>
        <Text style={styles.noticeText}>{response.guidance_notice}</Text>
      </View>
      {response.results.map((result) => (
        <View key={result.career.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.heading}>{result.career.name}</Text>
            <Text style={styles.score}>{result.score}%</Text>
          </View>
          <Text style={styles.summary}>{result.career.summary}</Text>
          {result.reasons.map((reason) => <Text key={reason} style={styles.reason}>✓ {reason}</Text>)}
          {result.missing_requirements.length ? (
            <Text style={styles.warning}>Check required subjects: {result.missing_requirements.join(', ')}</Text>
          ) : null}
          <Text style={styles.source}>
            {result.career.source.source_name} · {result.career.source.version_label}
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => save(result)}>
            <Text style={styles.primaryText}>Save to My Journey</Text>
          </Pressable>
          {result.practitioner_review_recommended ? (
            <Pressable style={styles.secondaryButton} onPress={() => router.push('/practitioner')}>
              <Text style={styles.secondaryText}>Talk to a career practitioner</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notice: { backgroundColor: colors.sky, borderRadius: 14, padding: spacing.md },
  noticeText: { color: colors.navy, lineHeight: 20 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 18, borderWidth: 1, gap: spacing.sm, padding: spacing.lg },
  cardHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  heading: { color: colors.navy, flex: 1, fontSize: 22, fontWeight: '800' },
  score: { backgroundColor: colors.sky, borderRadius: 99, color: colors.navy, fontSize: 16, fontWeight: '800', paddingHorizontal: 12, paddingVertical: 8 },
  summary: { color: colors.text, fontSize: 15, lineHeight: 22 },
  reason: { color: colors.success, fontSize: 14, lineHeight: 20 },
  warning: { color: colors.warning, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  source: { color: colors.muted, fontSize: 12 },
  primaryButton: { alignItems: 'center', backgroundColor: colors.teal, borderRadius: 13, minHeight: 48, justifyContent: 'center', padding: spacing.sm },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  secondaryButton: { alignItems: 'center', borderColor: colors.teal, borderRadius: 13, borderWidth: 1, minHeight: 48, justifyContent: 'center', padding: spacing.sm },
  secondaryText: { color: colors.tealDark, fontSize: 15, fontWeight: '800' },
});
