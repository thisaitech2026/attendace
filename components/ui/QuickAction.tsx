import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Link } from 'expo-router';

import Colors from '@/constants/Colors';
import { QUICK_ACTION_PICTURES, type QuickActionKey } from '@/constants/tabPictures';
import { useColorScheme } from '@/components/useColorScheme';

interface QuickActionProps {
  href: string;
  label: string;
  actionKey: QuickActionKey;
  color: string;
  bgColor: string;
  accentBg: string;
}

export function QuickAction({ href, label, actionKey, color, bgColor, accentBg }: QuickActionProps) {
  const art = QUICK_ACTION_PICTURES[actionKey];

  return (
    <Link href={href as never} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.wrap,
          { backgroundColor: bgColor, borderColor: accentBg, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] },
        ]}
      >
        <View style={[styles.pictureBox, { backgroundColor: accentBg }]}>
          <Text style={styles.emoji} accessibilityLabel={label}>
            {art.emoji}
          </Text>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <SymbolView
              name={art.icon as React.ComponentProps<typeof SymbolView>['name']}
              tintColor="#FFFFFF"
              size={11}
            />
          </View>
        </View>
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
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderWidth: 1,
  },
  pictureBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  emoji: { fontSize: 30, lineHeight: 34 },
  badge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 22,
    height: 22,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  label: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
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
