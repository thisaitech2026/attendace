import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';

import Colors from '@/constants/Colors';
import { QUICK_ACTION_PICTURES, type QuickActionKey } from '@/constants/tabPictures';
import { useColorScheme } from '@/components/useColorScheme';

interface QuickActionProps {
  href: string;
  label: string;
  actionKey: QuickActionKey;
  color: string;
}

export function QuickAction({ href, label, actionKey, color }: QuickActionProps) {
  const art = QUICK_ACTION_PICTURES[actionKey];

  return (
    <Link href={href as never} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.wrap,
          { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
        ]}
      >
        <Text style={styles.emoji} accessibilityLabel={label}>
          {art.emoji}
        </Text>
        <Text style={[styles.label, { color }]} numberOfLines={1}>
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
  wrap: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  emoji: { fontSize: 22, lineHeight: 26, marginBottom: 4 },
  label: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  title: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  action: { fontSize: 13, fontWeight: '600' },
});
