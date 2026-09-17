import { useQuery } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { getCareers } from '@/api/catalogue';
import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/theme';

export default function DirectoryScreen() {
  const query = useQuery({ queryKey: ['careers'], queryFn: () => getCareers() });
  return (
    <Screen>
      <Text style={styles.heading}>Career directory</Text>
      <Text style={styles.lead}>Browse source-labelled catalogue records and their content version.</Text>
      {query.isLoading ? <Text>Loading…</Text> : null}
      {query.error ? <Text style={styles.error}>The live directory is unavailable.</Text> : null}
      {query.data?.map((career) => (
        <View key={career.id} style={styles.card}>
          <Text style={styles.title}>{career.name}</Text>
          <Text style={styles.summary}>{career.summary}</Text>
          <Text style={styles.source}>{career.source.source_name} · {career.source.version_label}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.navy, fontSize: 27, fontWeight: '900' },
  lead: { color: colors.text, fontSize: 16 },
  error: { color: colors.error },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, gap: spacing.sm, padding: spacing.lg },
  title: { color: colors.navy, fontSize: 20, fontWeight: '800' },
  summary: { color: colors.text, lineHeight: 21 },
  source: { color: colors.muted, fontSize: 12 },
});
