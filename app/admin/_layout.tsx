import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type IoniconName = keyof typeof Ionicons.glyphMap;

const ADMIN_TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> = {
  index: { active: 'grid', inactive: 'grid-outline' },
  employees: { active: 'people', inactive: 'people-outline' },
  approvals: { active: 'checkmark-done-circle', inactive: 'checkmark-done-circle-outline' },
  'new-hire': { active: 'person-add', inactive: 'person-add-outline' },
};

const ADMIN_TAB_COLORS: Record<string, { active: string; inactive: string; bg: string }> = {
  index: { active: '#4F46E5', inactive: '#6366F1', bg: '#EEF2FF' },
  employees: { active: '#0891B2', inactive: '#0891B2', bg: '#ECFEFF' },
  approvals: { active: '#059669', inactive: '#059669', bg: '#ECFDF5' },
  'new-hire': { active: '#DB2777', inactive: '#DB2777', bg: '#FDF2F8' },
};

function AdminTabIcon({ routeName, focused }: { routeName: string; focused: boolean }) {
  const icons = ADMIN_TAB_ICONS[routeName] ?? ADMIN_TAB_ICONS.index;
  const palette = ADMIN_TAB_COLORS[routeName] ?? ADMIN_TAB_COLORS.index;

  return (
    <View style={[styles.iconWrap, { backgroundColor: focused ? `${palette.active}22` : palette.bg }]}>
      <Ionicons
        name={focused ? icons.active : icons.inactive}
        size={20}
        color={focused ? palette.active : palette.inactive}
      />
    </View>
  );
}

function adminTabOptions(routeName: string, title: string) {
  const palette = ADMIN_TAB_COLORS[routeName] ?? ADMIN_TAB_COLORS.index;

  return {
    title,
    tabBarActiveTintColor: palette.active,
    tabBarInactiveTintColor: palette.inactive,
    tabBarIcon: ({ focused }: { focused: boolean }) => (
      <AdminTabIcon routeName={routeName} focused={focused} />
    ),
  };
}

export default function AdminLayout() {
  const { isAuthenticated, isAdmin, logout, adminName } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }
  if (!isAdmin) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <>
      <Pressable
        style={[styles.topBar, { backgroundColor: colors.card, borderBottomColor: colors.borderLight, paddingTop: insets.top + 8 }]}
        onPress={logout}
      >
        <Text style={[styles.topTitle, { color: colors.text }]}>HR Admin · {adminName}</Text>
        <Text style={[styles.signOut, { color: colors.danger }]}>Sign out</Text>
      </Pressable>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.borderLight,
            paddingBottom: Platform.OS === 'ios' ? 22 : 10,
            height: Platform.OS === 'ios' ? 88 : 72,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={adminTabOptions('index', 'Dashboard')} />
        <Tabs.Screen name="employees" options={adminTabOptions('employees', 'Employees')} />
        <Tabs.Screen name="approvals" options={adminTabOptions('approvals', 'Approvals')} />
        <Tabs.Screen name="new-hire" options={adminTabOptions('new-hire', 'New Hire')} />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topTitle: { fontSize: 16, fontWeight: '800' },
  signOut: { fontSize: 13, fontWeight: '700' },
  iconWrap: {
    width: 32,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
