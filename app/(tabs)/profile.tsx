import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InfoRow } from '@/components/ui/InfoRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ProfileScreen() {
  const { employee, logout } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  if (!employee) return null;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <ScreenHeader title="My Profile" subtitle="Employee details" />

      <Card style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {employee.firstName} {employee.lastName}
        </Text>
        <Text style={[styles.position, { color: colors.textSecondary }]}>{employee.position}</Text>
        <Text style={[styles.department, { color: colors.primary }]}>{employee.department}</Text>
      </Card>

      <Card style={styles.detailsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Work Information</Text>
        <InfoRow label="Employee ID" value={employee.employeeId} />
        <InfoRow label="Department" value={employee.department} />
        <InfoRow label="Position" value={employee.position} />
        <InfoRow label="Manager" value={employee.manager} />
        <InfoRow label="Join Date" value={format(parseISO(employee.joinDate), 'MMMM d, yyyy')} />
      </Card>

      <Card style={styles.detailsCard}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Information</Text>
        <InfoRow label="Email" value={employee.email} />
        <InfoRow label="Phone" value={employee.phone} />
        <InfoRow label="Address" value={employee.address} />
        <InfoRow label="Emergency Contact" value={employee.emergencyContact} />
      </Card>

      <Button title="Sign Out" variant="outline" onPress={handleLogout} style={styles.logoutBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  profileCard: { alignItems: 'center', marginBottom: 16, paddingVertical: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#FFF', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700' },
  position: { fontSize: 14, marginTop: 4 },
  department: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  detailsCard: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  logoutBtn: { marginTop: 8 },
});
