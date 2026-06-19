import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { EmployeeAvatar } from '@/components/ui/EmployeeAvatar';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  position: string;
  employeeId: string;
  avatar?: string;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

interface ProfileSummaryProps {
  firstName: string;
  lastName: string;
  position: string;
  employeeId: string;
  avatar?: string;
  size?: number;
}

export function ProfileSummary({
  firstName,
  lastName,
  position,
  employeeId,
  avatar,
  size = 46,
}: ProfileSummaryProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={styles.left}>
      <EmployeeAvatar
        firstName={firstName}
        lastName={lastName}
        avatar={avatar}
        employeeId={employeeId}
        size={size}
        borderRadius={16}
        borderWidth={2}
        borderColor={colors.primary}
        backgroundColor={colors.primaryLight}
        textColor={colors.primary}
        fontSize={size > 50 ? 20 : 17}
        style={styles.avatar}
      />
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
  );
}

export function ProfileHeader({ firstName, lastName, position, employeeId, avatar }: ProfileHeaderProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <Link href="/profile" asChild>
      <Pressable style={({ pressed }) => [styles.wrap, { opacity: pressed ? 0.92 : 1 }]}>
        <ProfileSummary
          firstName={firstName}
          lastName={lastName}
          position={position}
          employeeId={employeeId}
          avatar={avatar}
        />
        <View style={[styles.chevron, { backgroundColor: colors.background }]}>
          <SymbolView name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} tintColor={colors.textMuted} size={14} />
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { marginRight: 12 },
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
