import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { UserRole } from '../../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(role);
    }, 800);
  };

  return (
    <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                <Ionicons name="business" size={40} color={colors.textInverse} />
              </View>
              <Text style={styles.appName}>RentHub</Text>
              <Text style={styles.tagline}>House & Shop Management</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.welcome}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your account</Text>

              <View style={styles.roleSelector}>
                <TouchableOpacity
                  style={[styles.roleBtn, role === 'admin' && styles.roleBtnActive]}
                  onPress={() => setRole('admin')}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={18}
                    color={role === 'admin' ? colors.primary : colors.textMuted}
                  />
                  <Text style={[styles.roleText, role === 'admin' && styles.roleTextActive]}>
                    Admin
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleBtn, role === 'customer' && styles.roleBtnActive]}
                  onPress={() => setRole('customer')}
                >
                  <Ionicons
                    name="person"
                    size={18}
                    color={role === 'customer' ? colors.primary : colors.textMuted}
                  />
                  <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>
                    Customer
                  </Text>
                </TouchableOpacity>
              </View>

              <Input
                label="Username"
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <Input
                label="Password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loading}
                size="lg"
                style={styles.loginBtn}
              />

              <Text style={styles.hint}>
                {role === 'admin'
                  ? 'Admin accounts are managed by system administrators.'
                  : 'Customer accounts are created by admin only.'}
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: spacing.xl },
  header: { alignItems: 'center', marginBottom: spacing.xxxl },
  logoWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  appName: { fontSize: 32, fontWeight: '800', color: colors.textInverse },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  welcome: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xl },
  roleSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  roleBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  roleText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  roleTextActive: { color: colors.primary },
  loginBtn: { marginTop: spacing.sm },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
});
