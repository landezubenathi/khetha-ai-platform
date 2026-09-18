import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getInterests, getSubjects } from '@/api/catalogue';
import { getRecommendations } from '@/api/guidance';
import { ChoiceChip } from '@/components/ChoiceChip';
import { Screen } from '@/components/Screen';
import { demoInterests, demoSubjects } from '@/data/demoCatalogue';
import { useGuidanceStore } from '@/store/guidanceStore';
import { colors, spacing } from '@/theme';

export default function SubjectChooserScreen() {
  const { t } = useTranslation();
  const store = useGuidanceStore();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const subjectsQuery = useQuery({ queryKey: ['subjects'], queryFn: getSubjects });
  const interestsQuery = useQuery({ queryKey: ['interests'], queryFn: getInterests });
  const subjects = subjectsQuery.data?.length ? subjectsQuery.data : demoSubjects;
  const interests = interestsQuery.data?.length ? interestsQuery.data : demoInterests;
  const usingDemoCatalogue =
    subjectsQuery.isError ||
    interestsQuery.isError ||
    (subjectsQuery.isSuccess && !subjectsQuery.data.length) ||
    (interestsQuery.isSuccess && !interestsQuery.data.length);

  const toggle = (code: string, values: string[], setter: (value: string[]) => void) =>
    setter(values.includes(code) ? values.filter((x) => x !== code) : [...values, code]);

  async function submit() {
    if (!store.subjectCodes.length) {
      setError(t('subjectChooser.chooseSubjectError'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await getRecommendations(store.subjectCodes, store.interestCodes);
      store.setResponse(response);
      router.push('/recommendations');
    } catch (value) {
      setError(value instanceof Error ? value.message : t('subjectChooser.loadError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.step}>{t('subjectChooser.subjectStep')}</Text>
      <Text style={styles.heading}>{t('subjectChooser.subjectHeading')}</Text>
      {usingDemoCatalogue ? <Text style={styles.offline}>{t('subjectChooser.demoNotice')}</Text> : null}
      <View style={styles.chips}>
        {subjects.map((item) => (
          <ChoiceChip
            key={item.code}
            label={t(`subjects.${item.code}`, { defaultValue: item.name })}
            selected={store.subjectCodes.includes(item.code)}
            onPress={() => toggle(item.code, store.subjectCodes, store.setSubjectCodes)}
          />
        ))}
      </View>

      <Text style={styles.step}>{t('subjectChooser.interestStep')}</Text>
      <Text style={styles.heading}>{t('subjectChooser.interestHeading')}</Text>
      <View style={styles.chips}>
        {interests.map((item) => (
          <ChoiceChip
            key={item.code}
            label={t(`interests.${item.code}`, { defaultValue: item.name })}
            selected={store.interestCodes.includes(item.code)}
            onPress={() => toggle(item.code, store.interestCodes, store.setInterestCodes)}
          />
        ))}
      </View>

      {error ? <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text> : null}
      <Pressable disabled={loading} onPress={submit} style={[styles.button, loading && styles.disabled]}>
        <Text style={styles.buttonText}>
          {loading ? t('subjectChooser.loading') : t('subjectChooser.submit')}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { color: colors.teal, fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
  heading: { color: colors.navy, fontSize: 23, fontWeight: '800' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  error: { color: colors.error, fontSize: 15 },
  offline: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  button: {
    alignItems: 'center', backgroundColor: colors.teal, borderRadius: 14,
    minHeight: 54, justifyContent: 'center', padding: spacing.md,
  },
  disabled: { opacity: 0.55 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
