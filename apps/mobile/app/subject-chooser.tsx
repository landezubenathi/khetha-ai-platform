import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getInterests, getSubjects } from '@/api/catalogue';
import { getRecommendations } from '@/api/guidance';
import { ChoiceChip } from '@/components/ChoiceChip';
import { Screen } from '@/components/Screen';
import { demoInterests, demoSubjects } from '@/data/demoCatalogue';
import { useGuidanceStore } from '@/store/guidanceStore';
import { colors, spacing } from '@/theme';

export default function SubjectChooserScreen() {
  const store = useGuidanceStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const subjectsQuery = useQuery({ queryKey: ['subjects'], queryFn: getSubjects });
  const interestsQuery = useQuery({ queryKey: ['interests'], queryFn: getInterests });
  const subjects = subjectsQuery.data ?? demoSubjects;
  const interests = interestsQuery.data ?? demoInterests;

  const toggle = (code: string, values: string[], setter: (value: string[]) => void) =>
    setter(values.includes(code) ? values.filter((x) => x !== code) : [...values, code]);

  async function submit() {
    if (!store.subjectCodes.length) {
      setError('Choose at least one subject.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getRecommendations(store.subjectCodes, store.interestCodes);
      store.setResponse(response);
      router.push('/recommendations');
    } catch (value) {
      setError(value instanceof Error ? value.message : 'Unable to load career options.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.step}>1 · Subjects</Text>
      <Text style={styles.heading}>Which subjects are you taking?</Text>
      <View style={styles.chips}>
        {subjects.map((item) => (
          <ChoiceChip
            key={item.code}
            label={item.name}
            selected={store.subjectCodes.includes(item.code)}
            onPress={() => toggle(item.code, store.subjectCodes, store.setSubjectCodes)}
          />
        ))}
      </View>

      <Text style={styles.step}>2 · Interests</Text>
      <Text style={styles.heading}>What kind of work interests you?</Text>
      <View style={styles.chips}>
        {interests.map((item) => (
          <ChoiceChip
            key={item.code}
            label={item.name}
            selected={store.interestCodes.includes(item.code)}
            onPress={() => toggle(item.code, store.interestCodes, store.setInterestCodes)}
          />
        ))}
      </View>

      {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
      <Pressable disabled={loading} onPress={submit} style={[styles.button, loading && styles.disabled]}>
        <Text style={styles.buttonText}>{loading ? 'Finding options…' : 'Show career options'}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { color: colors.teal, fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
  heading: { color: colors.navy, fontSize: 23, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  error: { color: colors.error, fontSize: 15 },
  button: {
    alignItems: 'center', backgroundColor: colors.teal, borderRadius: 14,
    minHeight: 54, justifyContent: 'center', padding: spacing.md,
  },
  disabled: { opacity: 0.55 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
