import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  accent?: string;
  icon?: { ios: string; android: string; web: string };
}

export function StatCard({ label, value, subtitle, accent, icon }: StatCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight, shadowColor: colors.shadow }]}>
      {icon ? (
        <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>
          <SymbolView
            name={icon as React.ComponentProps<typeof SymbolView>['name']}
            tintColor={accent ?? colors.primary}
            size={18}
          />
        </View>
      ) : null}
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.value, { color: accent ?? colors.text }]}>{value}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  value: { fontSize: 24, fontWeight: '800', marginTop: 4, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, marginTop: 4, fontWeight: '500' },
});
