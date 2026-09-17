import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing } from '@/theme';

type Props = { label: string; selected: boolean; onPress: () => void };

export function ChoiceChip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selected]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderColor: colors.border,
    borderRadius: 99,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  selected: { backgroundColor: colors.teal, borderColor: colors.teal },
  label: { color: colors.text, fontSize: 15 },
  selectedLabel: { color: '#FFFFFF', fontWeight: '700' },
});

