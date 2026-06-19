import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { customerDashboard } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ProfileScreenProps {
  navigation: any;
  onLogout: () => void;
}

export function ProfileScreen({ navigation, onLogout }: ProfileScreenProps) {
  const { customer } = customerDashboard;

  const fields = [
    { label: 'Mobile', value: customer.mobile },
    { label: 'Email', value: customer.email },
    { label: 'Address', value: customer.address },
    { label: 'Occupation', value: customer.occupation },
    { label: 'Emergency Contact', value: customer.emergencyContact },
    { label: 'Username', value: customer.username },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="My Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{customer.name}</Text>
        <Text style={styles.id}>{customer.id}</Text>

        <Card style={styles.card}>
          {fields.map((field) => (
            <View key={field.label} style={styles.row}>
              <Text style={styles.label}>{field.label}</Text>
              <Text style={styles.value}>{field.value}</Text>
            </View>
          ))}
        </Card>

        <Button title="Sign Out" variant="danger" onPress={onLogout} size="lg" style={styles.logoutBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, alignItems: 'center', paddingBottom: spacing.xxxl * 2 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.primary },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  id: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.xl },
  card: { width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  label: { fontSize: 14, color: colors.textSecondary },
  value: { fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'right', flex: 1, marginLeft: spacing.lg },
  logoutBtn: { width: '100%', marginTop: spacing.xxl },
});
