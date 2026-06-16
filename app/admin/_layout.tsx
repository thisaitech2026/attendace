import { Tabs, Redirect } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

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
        <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
        <Tabs.Screen name="employees" options={{ title: 'Employees' }} />
        <Tabs.Screen name="approvals" options={{ title: 'Approvals' }} />
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
