import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View, type ColorValue } from 'react-native';

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

function TabIcon({ name, color, focused }: { name: TabIconName; color: ColorValue; focused: boolean }) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={[styles.iconWrap, focused && { backgroundColor: colors.primaryLight }]}>
      <SymbolView
        name={name as React.ComponentProps<typeof SymbolView>['name']}
        tintColor={color as string}
        size={22}
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          height: Platform.OS === 'ios' ? 88 : 72,
          elevation: 12,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={{ ios: 'house.fill', android: 'home', web: 'home' }} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Time',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: 'Leave',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={{ ios: 'calendar', android: 'event', web: 'event' }} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="performance"
        options={{
          title: 'Goals',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' }} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="salary"
        options={{
          title: 'Pay',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={{ ios: 'dollarsign.circle.fill', android: 'payments', web: 'payments' }} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 44,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
