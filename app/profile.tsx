import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmployeeAvatar } from '@/components/ui/EmployeeAvatar';
import { InfoRow } from '@/components/ui/InfoRow';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ProfileScreen() {
  const { employee, logout } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  if (!employee) return null;

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.content, { paddingTop: 8, paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.profileCard}>
          <EmployeeAvatar
            firstName={employee.firstName}
            lastName={employee.lastName}
            avatar={employee.avatar}
            employeeId={employee.employeeId}
            size={88}
            borderRadius={28}
            borderWidth={3}
            borderColor={colors.primary}
            backgroundColor={colors.primaryLight}
            textColor={colors.primary}
            fontSize={32}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: colors.text }]}>
            {employee.firstName} {employee.lastName}
          </Text>
          <Text style={[styles.position, { color: colors.textSecondary }]}>{employee.position}</Text>
          <View style={[styles.deptBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.department, { color: colors.primary }]}>{employee.department}</Text>
          </View>
          <Text style={[styles.empId, { color: colors.textMuted }]}>{employee.employeeId}</Text>
        </Card>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>WORK</Text>
        <Card style={styles.detailsCard}>
          <InfoRow label="Employee ID" value={employee.employeeId} />
          <InfoRow label="Department" value={employee.department} />
          <InfoRow label="Position" value={employee.position} />
          <InfoRow label="Manager" value={employee.manager} />
          <InfoRow label="Join Date" value={format(parseISO(employee.joinDate), 'MMMM d, yyyy')} last />
        </Card>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CONTACT</Text>
        <Card style={styles.detailsCard}>
          <InfoRow label="Email" value={employee.email} />
          <InfoRow label="Phone" value={employee.phone} />
          <InfoRow label="Address" value={employee.address} />
          <InfoRow label="Emergency" value={employee.emergencyContact} last />
        </Card>

        <Button title="Sign Out" variant="outline" onPress={handleLogout} style={styles.logoutBtn} />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20 },
  profileCard: { alignItems: 'center', marginBottom: 20, paddingVertical: 28 },
  avatar: { marginBottom: 14 },
  name: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  position: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  deptBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  department: { fontSize: 12, fontWeight: '700' },
  empId: { fontSize: 12, marginTop: 8, fontWeight: '500' },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  detailsCard: { marginBottom: 20 },
  logoutBtn: { marginTop: 4 },
});
