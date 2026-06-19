import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { PropertiesScreen } from '../screens/admin/PropertiesScreen';
import { PropertyFormScreen } from '../screens/admin/PropertyFormScreen';
import { PropertyDetailScreen } from '../screens/admin/PropertyDetailScreen';
import { CustomersScreen } from '../screens/admin/CustomersScreen';
import { CustomerFormScreen } from '../screens/admin/CustomerFormScreen';
import { CustomerDetailScreen } from '../screens/admin/CustomerDetailScreen';
import { RentalsScreen } from '../screens/admin/RentalsScreen';
import { RentalFormScreen } from '../screens/admin/RentalFormScreen';
import { UtilitiesScreen } from '../screens/admin/UtilitiesScreen';
import { ReportsScreen } from '../screens/admin/ReportsScreen';
import { PaymentsScreen } from '../screens/admin/PaymentsScreen';
import { OverdueScreen } from '../screens/admin/OverdueScreen';
import { AdminMoreScreen } from '../screens/admin/AdminMoreScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AdminTabs({ onLogout }: { onLogout: () => void }) {
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
            Dashboard: 'grid',
            Properties: 'business',
            Customers: 'people',
            Rentals: 'link',
            More: 'menu',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Properties" component={PropertiesScreen} />
      <Tab.Screen name="Customers" component={CustomersScreen} />
      <Tab.Screen name="Rentals" component={RentalsScreen} />
      <Tab.Screen name="More" children={() => <AdminMoreScreen onLogout={onLogout} />} />
    </Tab.Navigator>
  );
}

export function AdminNavigator({ onLogout }: { onLogout: () => void }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs">
        {() => <AdminTabs onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="PropertyForm" component={PropertyFormScreen} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen as any} />
      <Stack.Screen name="CustomerForm" component={CustomerFormScreen} />
      <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen as any} />
      <Stack.Screen name="RentalForm" component={RentalFormScreen} />
      <Stack.Screen name="Utilities" component={UtilitiesScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
      <Stack.Screen name="Payments" component={PaymentsScreen} />
      <Stack.Screen name="Overdue" component={OverdueScreen} />
    </Stack.Navigator>
  );
}
