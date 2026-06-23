import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  inset?: boolean;
  compact?: boolean;
}

export function ScreenHeader({ title, subtitle, inset = true, compact = false }: ScreenHeaderProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const safeInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, compact && styles.containerCompact, inset && { paddingTop: safeInsets.top + 8 }]}>
      <Text style={[styles.title, compact && styles.titleCompact, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  containerCompact: { marginBottom: 6 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  titleCompact: { fontSize: 22, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4, fontWeight: '500' },
});
