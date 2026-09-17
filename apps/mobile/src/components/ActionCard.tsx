import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/theme';

type Props = {
  title: string;
  body: string;
  action: string;
  icon?: ReactNode;
  onPress: () => void;
};

export function ActionCard({ title, body, action, icon, onPress }: Props) {
  return (
    <View style={styles.card}>
      {icon}
      <Text accessibilityRole="header" style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
      <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{action}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  title: { color: colors.navy, fontSize: 21, fontWeight: '800' },
  body: { color: colors.text, fontSize: 16, lineHeight: 23 },
  button: {
    alignItems: 'center',
    backgroundColor: colors.teal,
    borderRadius: 13,
    marginTop: spacing.sm,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

