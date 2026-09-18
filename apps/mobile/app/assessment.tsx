import { useQuery } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getInterestExplorer, submitInterestExplorer } from '@/api/assessments';
import { ChoiceChip } from '@/components/ChoiceChip';
import { Screen } from '@/components/Screen';
import { demoAssessment } from '@/data/demoCatalogue';
import { useGuidanceStore } from '@/store/guidanceStore';
import { colors, spacing } from '@/theme';

export default function AssessmentScreen() {
  const { t } = useTranslation();
  const query = useQuery({ queryKey: ['interest-explorer'], queryFn: getInterestExplorer });
  const setInterestCodes = useGuidanceStore((state) => state.setInterestCodes);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const assessment = query.data ?? demoAssessment;
  const complete = assessment.questions.every((question) => answers[question.id]);

  async function continueToSubjects() {
    const codes = new Set<string>();
    for (const question of assessment.questions) {
      const option = question.options.find((item) => item.id === answers[question.id]);
      option?.scoring_metadata.interest_codes?.forEach((code) => codes.add(code));
    }
    setInterestCodes([...codes]);
    if (query.data) {
      try {
        await submitInterestExplorer(
          Crypto.randomUUID(),
          assessment.questions.map((question) => ({
            question_id: question.id,
            option_id: answers[question.id],
          })),
        );
      } catch {
        // The learner can continue; the selected interests are already held locally.
      }
    }
    router.push('/subject-chooser');
  }

  return (
    <Screen>
      <Text style={styles.heading}>
        {t('assessment.title', { defaultValue: assessment.title })}
      </Text>
      <Text style={styles.notice}>
        {t('assessment.instructions', { defaultValue: assessment.instructions ?? '' })}
      </Text>
      {query.isError ? <Text style={styles.offline}>{t('assessment.offlineNotice')}</Text> : null}
      {assessment.questions.map((question) => (
        <View key={question.id} style={styles.question}>
          <Text style={styles.prompt}>
            {question.sequence_number}.{' '}
            {t(`assessment.questions.${question.sequence_number}`, { defaultValue: question.prompt })}
          </Text>
          <View style={styles.options}>
            {question.options.map((option) => (
              <ChoiceChip
                key={option.id}
                label={t(`assessment.options.${option.value}`, { defaultValue: option.label })}
                selected={answers[question.id] === option.id}
                onPress={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
              />
            ))}
          </View>
        </View>
      ))}
      <Pressable disabled={!complete} onPress={continueToSubjects} style={[styles.button, !complete && styles.disabled]}>
        <Text style={styles.buttonText}>{t('assessment.continue')}</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.navy, fontSize: 27, fontWeight: '900' },
  notice: { color: colors.warning, fontSize: 14, lineHeight: 20 },
  question: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  prompt: { color: colors.navy, fontSize: 18, fontWeight: '800', lineHeight: 24 },
  options: { gap: spacing.sm },
  offline: { color: colors.muted, fontSize: 13 },
  button: { alignItems: 'center', backgroundColor: colors.teal, borderRadius: 13, minHeight: 52, justifyContent: 'center' },
  disabled: { opacity: 0.45 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
});
