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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DEMO_LOGINS, useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { APP_NAME } from '@/constants/config';
import type { UserRole } from '@/types/employee';
import { useColorScheme } from '@/components/useColorScheme';

export default function LoginScreen() {
  const { isAuthenticated, isLoading, login, isAdmin } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<UserRole>('employee');
  const [email, setEmail] = useState(DEMO_LOGINS.employee.email);
  const [password, setPassword] = useState(DEMO_LOGINS.employee.password);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const switchRole = (next: UserRole) => {
    setRole(next);
    setEmail(DEMO_LOGINS[next].email);
    setPassword(DEMO_LOGINS[next].password);
    setError('');
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

  const handleLogin = async () => {
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={[styles.headerGradient, { paddingTop: insets.top + 40 }]}
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
            <Text style={[styles.formTitle, { color: colors.text }]}>Sign in</Text>
            <Text style={[styles.formSub, { color: colors.textSecondary }]}>Choose your access type</Text>

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

            <Text style={[styles.label, { color: colors.textMuted }]}>EMAIL</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.background }]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@company.com"
              placeholderTextColor={colors.textMuted}
            />

            <Text style={[styles.label, { color: colors.textMuted }]}>PASSWORD</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.background }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
            />

            {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}

            <Button title="Sign In" onPress={handleLogin} loading={submitting} size="lg" style={styles.button} />
          </Card>

          <Text style={[styles.demo, { color: colors.textMuted }]}>
            Employee: john.doe@company.com / password123{'\n'}
            Admin/HR: hr.admin@company.com / admin123
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerGradient: { paddingBottom: 48, alignItems: 'center', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoText: { color: '#FFF', fontSize: 26, fontWeight: '800' },
  appName: { color: '#FFF', fontSize: 30, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6, fontWeight: '500' },
  formArea: { flex: 1, marginTop: -24 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  form: { padding: 24 },
  formTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  formSub: { fontSize: 14, marginTop: 4, marginBottom: 16, fontWeight: '500' },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  roleChip: { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, alignItems: 'center' },
  roleText: { fontSize: 13, fontWeight: '700' },
  label: { fontSize: 11, fontWeight: '700', marginBottom: 8, marginTop: 14, letterSpacing: 0.8 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, fontWeight: '500' },
  error: { marginTop: 12, fontSize: 14, fontWeight: '500' },
  button: { marginTop: 24 },
  demo: { textAlign: 'center', marginTop: 20, fontSize: 12, fontWeight: '500', lineHeight: 18 },
});
