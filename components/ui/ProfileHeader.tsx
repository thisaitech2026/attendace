import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  position: string;
  employeeId: string;
}

export function ProfileHeader({ firstName, lastName, position, employeeId }: ProfileHeaderProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const initials = `${firstName[0]}${lastName[0]}`;

  return (
    <Link href="/profile" asChild>
      <Pressable style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.92 : 1 }]}>
        <View style={styles.left}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Text style={[styles.initials, { color: colors.primary }]}>{initials}</Text>
          </View>
          <View style={styles.info}>
            <Text style={[styles.greeting, { color: colors.textMuted }]}>Good {getGreeting()}</Text>
            <Text style={[styles.name, { color: colors.text }]}>
              {firstName} {lastName}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]} numberOfLines={1}>
              {position}
            </Text>
          </View>
        </View>
        <View style={[styles.chevron, { backgroundColor: colors.background }]}>
          <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor={colors.textMuted} size={14} />
        </View>
      </Pressable>
    </Link>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginRight: 12,
  },
  initials: { fontSize: 17, fontWeight: '800' },
  info: { flex: 1 },
  greeting: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
  name: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, marginTop: 2 },
  meta: { fontSize: 13, marginTop: 3, fontWeight: '500' },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
