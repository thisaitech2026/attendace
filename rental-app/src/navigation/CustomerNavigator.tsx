import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CustomerDashboardScreen } from '../screens/customer/CustomerDashboardScreen';
import { CustomerUtilitiesScreen } from '../screens/customer/CustomerUtilitiesScreen';
import { PaymentScreen } from '../screens/customer/PaymentScreen';
import { PaymentHistoryScreen } from '../screens/customer/PaymentHistoryScreen';
import { ReceiptsScreen } from '../screens/customer/ReceiptsScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CustomerTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home',
            Pay: 'card',
            History: 'time',
            Profile: 'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={CustomerDashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Pay" component={PaymentScreen} options={{ title: 'Pay Rent' }} />
      <Tab.Screen name="History" component={PaymentHistoryScreen} options={{ title: 'History' }} />
      <Tab.Screen name="Profile" options={{ title: 'Profile' }}>
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function CustomerNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomerTabs">
        {() => <CustomerTabs onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Utilities" component={CustomerUtilitiesScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="Receipts" component={ReceiptsScreen} />
    </Stack.Navigator>
  );
}
