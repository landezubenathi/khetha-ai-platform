import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { colors, spacing } from '@/theme';

export default function ProfileScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <Text style={styles.heading}>{t('profileScreen.heading')}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>{t('profileScreen.connectivity')}</Text>
        <Text style={styles.value}>{t('profileScreen.lowData')}</Text>
        <Text style={styles.label}>{t('profileScreen.contentStatus')}</Text>
        <Text style={styles.value}>{t('profileScreen.demoCatalogue')}</Text>
        <Text style={styles.label}>{t('profileScreen.consent')}</Text>
        <Text style={styles.value}>{t('profileScreen.guidanceOnly')}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>{t('profileScreen.language')}</Text>
        <View style={styles.row}>
          <Pressable style={styles.button} onPress={() => i18n.changeLanguage('en')}><Text>English</Text></Pressable>
          <Pressable style={styles.button} onPress={() => i18n.changeLanguage('xh')}><Text>isiXhosa</Text></Pressable>
        </View>
        <Text style={styles.help}>{t('profileScreen.languageHelp')}</Text>
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
