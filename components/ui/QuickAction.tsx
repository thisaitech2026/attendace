import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Link } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface QuickActionProps {
  href: string;
  label: string;
  icon: { ios: string; android: string; web: string };
  color: string;
  bgColor: string;
}

export function QuickAction({ href, label, icon, color, bgColor }: QuickActionProps) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <SymbolView name={icon as React.ComponentProps<typeof SymbolView>['name']} tintColor={color} size={22} />
        </View>
        <Text style={[styles.label, { color }]} numberOfLines={2}>
          {label}
        </Text>
      </Pressable>
    </Link>
  );
}

interface SectionHeaderProps {
  title: string;
  action?: { label: string; href: string };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {action ? (
        <Link href={action.href as never} asChild>
          <Pressable>
            <Text style={[styles.action, { color: colors.primary }]}>{action.label}</Text>
          </Pressable>
        </Link>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: '23%' },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: { fontSize: 11, fontWeight: '600', textAlign: 'center', lineHeight: 14 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 4,
  },
  title: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  action: { fontSize: 13, fontWeight: '600' },
});
