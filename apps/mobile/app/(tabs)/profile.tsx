import i18n from '@/i18n';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/theme';

export default function ProfileScreen() {
  return (
    <Screen>
      <Text style={styles.heading}>Profile and preferences</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Connectivity</Text>
        <Text style={styles.value}>Low-data mode</Text>
        <Text style={styles.label}>Content status</Text>
        <Text style={styles.value}>Demonstration catalogue</Text>
        <Text style={styles.label}>Consent</Text>
        <Text style={styles.value}>Career guidance only</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Interface language</Text>
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={() => i18n.changeLanguage('en')}><Text>English</Text></Pressable>
          <Pressable style={styles.button} onPress={() => i18n.changeLanguage('xh')}><Text>isiXhosa</Text></Pressable>
        </View>
        <Text style={styles.help}>Only interface labels are translated in the prototype. Career content requires authorised translation review.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { color: colors.navy, fontSize: 27, fontWeight: '900' },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 16, borderWidth: 1, gap: spacing.sm, padding: spacing.lg },
  label: { color: colors.muted, fontSize: 13, fontWeight: '700', textTransform: 'uppercase' },
  value: { color: colors.text, fontSize: 17, marginBottom: spacing.sm },
  row: { flexDirection: 'row', gap: spacing.sm },
  button: { borderColor: colors.border, borderRadius: 12, borderWidth: 1, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },
  help: { color: colors.muted, fontSize: 13, lineHeight: 19 },
});

