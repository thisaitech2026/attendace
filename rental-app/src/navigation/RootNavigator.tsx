import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { AdminNavigator } from './AdminNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { UserRole } from '../types';

export function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>('admin');

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : role === 'admin' ? (
        <AdminNavigator onLogout={handleLogout} />
      ) : (
        <CustomerNavigator onLogout={handleLogout} />
      )}
    </NavigationContainer>
  );
}
