import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';

import { TabBarPicture } from '@/components/ui/TabBarPicture';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 22 : 10,
          height: Platform.OS === 'ios' ? 118 : 100,
          elevation: 16,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 1,
          shadowRadius: 14,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabBarPicture tabKey="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Time',
          tabBarIcon: ({ color, focused }) => <TabBarPicture tabKey="time" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="leave"
        options={{
          title: 'Leave',
          tabBarIcon: ({ color, focused }) => <TabBarPicture tabKey="leave" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => <TabBarPicture tabKey="chat" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="salary"
        options={{
          title: 'Pay',
          tabBarIcon: ({ color, focused }) => <TabBarPicture tabKey="pay" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    marginBottom: 0,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
    letterSpacing: 0.2,
  },
});
