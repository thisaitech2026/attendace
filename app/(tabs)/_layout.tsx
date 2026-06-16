import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { Platform, type ColorValue } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type TabIconName = {
  ios: React.ComponentProps<typeof SymbolView>['name'] extends infer N
    ? N extends { ios?: infer I }
      ? I
      : N
    : never;
  android: string;
  web: string;
};

function TabIcon({ name, color }: { name: TabIconName; color: ColorValue }) {
  return <SymbolView name={name as React.ComponentProps<typeof SymbolView>['name']} tintColor={color as string} size={24} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? 0 : 4,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'house.fill', android: 'home', web: 'home' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: 'Leave',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'calendar', android: 'event', web: 'event' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: 'Performance',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="salary"
        options={{
          title: 'Salary',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'dollarsign.circle.fill', android: 'payments', web: 'payments' }} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <TabIcon name={{ ios: 'person.fill', android: 'person', web: 'person' }} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
