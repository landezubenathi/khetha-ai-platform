import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionCard } from '@/components/ActionCard';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <Text accessibilityRole="header" style={styles.heading}>Your career journey, in your hands.</Text>
        <Text style={styles.lead}>
          Explore subjects and pathways, save your next steps and reach a career practitioner when you need help.
        </Text>
      </View>
      <ActionCard
        title="Find my path"
        body="Match your subjects and interests to explainable career options."
        action="Start exploring"
        onPress={() => router.push('/subject-chooser')}
      />
      <ActionCard
        title="Interest explorer"
        body="Answer three short questions to discover interests you may want to explore."
        action="Start questions"
        onPress={() => router.push('/assessment')}
      />
      <ActionCard
        title="My journey"
        body="Open careers and next steps saved on this device, even with limited connectivity."
        action="View saved journey"
        onPress={() => router.push('/(tabs)/journey')}
      />
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Prototype notice: demo records must be replaced with authorised DHET/NCAP information before pilot use.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.sm, marginBottom: spacing.sm },
  heading: { color: colors.navy, fontSize: 31, fontWeight: '900', lineHeight: 37 },
  lead: { color: colors.text, fontSize: 17, lineHeight: 25 },
  notice: { backgroundColor: colors.sky, borderRadius: 14, padding: spacing.md },
  noticeText: { color: colors.navy, fontSize: 14, lineHeight: 20 },
});
