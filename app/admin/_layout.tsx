import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
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

function AdminTabIcon({ routeName, color, focused }: { routeName: string; color: string; focused: boolean }) {
  const icons = ADMIN_TAB_ICONS[routeName] ?? ADMIN_TAB_ICONS.index;
  return <Ionicons name={focused ? icons.active : icons.inactive} size={22} color={color} />;
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
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarStyle: {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.borderLight,
            paddingBottom: Platform.OS === 'ios' ? 22 : 10,
            height: Platform.OS === 'ios' ? 88 : 72,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => <AdminTabIcon routeName="index" color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="employees"
          options={{
            title: 'Employees',
            tabBarIcon: ({ color, focused }) => <AdminTabIcon routeName="employees" color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="approvals"
          options={{
            title: 'Approvals',
            tabBarIcon: ({ color, focused }) => <AdminTabIcon routeName="approvals" color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="new-hire"
          options={{
            title: 'New Hire',
            tabBarIcon: ({ color, focused }) => <AdminTabIcon routeName="new-hire" color={color} focused={focused} />,
          }}
        />
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
});
