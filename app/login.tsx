import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { APP_NAME } from '@/constants/config';
import type { UserRole } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';

type AuthMode = 'signin' | 'register';

export default function LoginScreen() {
  const { isAuthenticated, isLoading, login, register, isAdmin } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [role, setRole] = useState<UserRole>('employee');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchRole = (next: UserRole) => {
    setRole(next);
    setConfirmPassword('');
    setError('');
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    if (next === 'signin') {
      setRole('employee');
    } else {
      setRole('employee');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href={isAdmin ? '/admin' : '/(tabs)'} />;
  }

  const handleSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      await login(email.trim(), password, role);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isRegister = mode === 'register';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>TA</Text>
        </View>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>Employee & HR portal</Text>
      </LinearGradient>

      <KeyboardAvoidingView style={styles.formArea} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Card style={styles.form}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              {isRegister ? 'Create account' : 'Sign in'}
            </Text>
            <Text style={[styles.formSub, { color: colors.textSecondary }]}>
              {isRegister ? 'Register as a new employee' : 'Choose your access type'}
            </Text>

            {!isRegister ? (
              <View style={styles.roleRow}>
                {(['employee', 'admin'] as UserRole[]).map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.roleChip,
                      {
                        backgroundColor: role === item ? colors.primaryLight : colors.background,
                        borderColor: role === item ? colors.primary : colors.borderLight,
                      },
                    ]}
                    onPress={() => switchRole(item)}
                  >
                    <Text style={[styles.roleText, { color: role === item ? colors.primary : colors.textSecondary }]}>
                      {item === 'employee' ? 'Employee' : 'Admin / HR'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : null}

            {isRegister ? (
              <>
                <Text style={[styles.label, { color: colors.textMuted }]}>FIRST NAME</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.background }]}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  placeholder="John"
                  placeholderTextColor={colors.textMuted}
                />
                <Text style={[styles.label, { color: colors.textMuted }]}>LAST NAME</Text>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.background }]}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  placeholder="Doe"
                  placeholderTextColor={colors.textMuted}
                />
              </>
            ) : null}

            <Text style={[styles.label, { color: colors.textMuted }]}>EMAIL</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.background }]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="off"
              textContentType="none"
              keyboardType="email-address"
              placeholder="you@company.com"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { color: colors.textMuted }]}>PASSWORD</Text>
            <PasswordField
              value={password}
              onChangeText={setPassword}
              visible={showPassword}
              onToggleVisible={() => setShowPassword((prev) => !prev)}
              colors={colors}
              autoComplete="off"
            />

            {isRegister ? (
              <>
                <Text style={[styles.label, { color: colors.textMuted }]}>CONFIRM PASSWORD</Text>
                <PasswordField
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  visible={showConfirmPassword}
                  onToggleVisible={() => setShowConfirmPassword((prev) => !prev)}
                  colors={colors}
                  autoComplete="off"
                />
              </>
            ) : null}

            {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

            <Button
              title={isRegister ? 'Create Account' : 'Sign In'}
              onPress={isRegister ? handleRegister : handleSignIn}
              loading={submitting}
              size="lg"
              style={styles.button}
            />

            <Pressable onPress={() => switchMode(isRegister ? 'signin' : 'register')} style={styles.switchMode}>
              <Text style={[styles.switchModeText, { color: colors.primary }]}>
                {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
              </Text>
            </Pressable>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function PasswordField({
  value,
  onChangeText,
  visible,
  onToggleVisible,
  colors,
  autoComplete = 'off',
}: {
  value: string;
  onChangeText: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  colors: (typeof Colors)['light'];
  autoComplete?: 'off' | 'new-password' | 'password';
}) {
  return (
    <View
      style={[
        styles.passwordWrap,
        { borderColor: colors.borderLight, backgroundColor: colors.background },
      ]}
    >
      <TextInput
        style={[styles.passwordInput, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visible}
        placeholder="••••••••"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete={autoComplete}
        textContentType={visible ? 'none' : 'password'}
      />
      <Pressable
        onPress={onToggleVisible}
        hitSlop={8}
        style={styles.eyeBtn}
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      >
        <Ionicons
          name={visible ? 'eye-off-outline' : 'eye-outline'}
          size={20}
          color={colors.textMuted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerGradient: { paddingBottom: 28, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  appName: { color: '#FFF', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2, fontWeight: '500' },
  formArea: { flex: 1, marginTop: -18 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  form: { padding: 24 },
  formTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  formSub: { fontSize: 14, marginTop: 4, marginBottom: 16, fontWeight: '500' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  roleChip: { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, alignItems: 'center' },
  roleText: { fontSize: 13, fontWeight: '700' },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 8, marginTop: 14, letterSpacing: 0.8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '500' },
  passwordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: { marginTop: 12, fontSize: 14, fontWeight: '500' },
  button: { marginTop: 24 },
  switchMode: { marginTop: 16, alignItems: 'center', paddingVertical: 4 },
  switchModeText: { fontSize: 14, fontWeight: '700' },
});
