import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface InfoRowProps {
  label: string;
  value: string;
  last?: boolean;
}

export function InfoRow({ label, value, last = false }: InfoRowProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={[styles.row, !last && { borderBottomColor: colors.borderLight, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 13 },
  label: { fontSize: 11, marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
});
