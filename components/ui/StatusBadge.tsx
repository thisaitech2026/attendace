import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface StatusBadgeProps {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary';
}

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  const toneColors = {
    success: { bg: '#D1FAE5', text: colors.success },
    warning: { bg: '#FEF3C7', text: colors.warning },
    danger: { bg: '#FEE2E2', text: colors.danger },
    primary: { bg: colors.primaryLight, text: colors.primary },
    neutral: { bg: colors.border, text: colors.textSecondary },
  }[tone];

  return (
    <View style={[styles.badge, { backgroundColor: toneColors.bg }]}>
      <Text style={[styles.text, { color: toneColors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
