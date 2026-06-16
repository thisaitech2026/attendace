import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface StatusBadgeProps {
  label: string;
  tone?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary';
  light?: boolean;
}

export function StatusBadge({ label, tone = 'neutral', light = false }: StatusBadgeProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  if (light) {
    return (
      <View style={styles.badgeLight}>
        <Text style={styles.textLight}>{label}</Text>
      </View>
    );
  }

  const toneColors = {
    success: { bg: colors.successLight, text: colors.success },
    warning: { bg: colors.warningLight, text: colors.warning },
    danger: { bg: colors.dangerLight, text: colors.danger },
    primary: { bg: colors.primaryLight, text: colors.primary },
    neutral: { bg: colors.borderLight, text: colors.textSecondary },
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
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeLight: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  textLight: { fontSize: 11, fontWeight: '700', color: '#FFF', textTransform: 'capitalize' },
});
