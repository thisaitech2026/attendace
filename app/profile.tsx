import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EditableProfileAvatar } from '@/components/ui/EditableProfileAvatar';
import { InfoRow } from '@/components/ui/InfoRow';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { showAlert, showConfirm } from '@/utils/uiAlert';

export default function ProfileScreen() {
  const { employee, logout, updateProfile } = useApp();
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);

  useEffect(() => {
    if (!employee) return;
    setPhone(employee.phone.replace(/\D/g, '').slice(0, 10));
    setAddress(employee.address);
    setEmergencyContact(employee.emergencyContact.replace(/\D/g, '').slice(0, 10));
  }, [employee]);

  if (!employee) return null;

  const handleLogout = async () => {
    const confirmed = await showConfirm('Sign Out', 'Are you sure you want to sign out?');
    if (confirmed) await logout();
  };

  const handleAvatarChange = async (avatarUri: string) => {
    setAvatarSaving(true);
    try {
      await updateProfile({ phone, address, emergencyContact, avatar: avatarUri });
    } finally {
      setAvatarSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ phone, address, emergencyContact });
      showAlert('Profile updated', 'Your contact details have been saved.');
    } catch (error) {
      showAlert('Could not save', error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={styles.headerCard}>
        <View style={styles.headerRow}>
          <EditableProfileAvatar
            firstName={employee.firstName}
            lastName={employee.lastName}
            avatar={employee.avatar}
            size={72}
            onAvatarChange={handleAvatarChange}
          />
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: colors.text }]}>
              {employee.firstName} {employee.lastName}
            </Text>
            <Text style={[styles.position, { color: colors.textSecondary }]} numberOfLines={2}>
              {employee.position}
            </Text>
            <Text style={[styles.employeeId, { color: colors.textMuted }]}>{employee.employeeId}</Text>
          </View>
        </View>
        {avatarSaving ? (
          <Text style={[styles.avatarHint, { color: colors.textMuted }]}>Saving photo...</Text>
        ) : (
          <Text style={[styles.avatarHint, { color: colors.textMuted }]}>Tap + to add your profile photo</Text>
        )}
      </Card>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>EDIT PROFILE</Text>
      <Card style={styles.editCard}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>PHONE</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.background }]}
          value={phone}
          onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          placeholder="10 digit phone number"
          placeholderTextColor={colors.textMuted}
          maxLength={10}
        />

        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>ADDRESS</Text>
        <TextInput
          style={[styles.input, styles.textArea, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.background }]}
          value={address}
          onChangeText={setAddress}
          placeholder="Home address"
          placeholderTextColor={colors.textMuted}
          multiline
        />

        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>EMERGENCY CONTACT</Text>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.borderLight, backgroundColor: colors.background }]}
          value={emergencyContact}
          onChangeText={(value) => setEmergencyContact(value.replace(/\D/g, '').slice(0, 10))}
          keyboardType="phone-pad"
          placeholder="10 digit emergency number"
          placeholderTextColor={colors.textMuted}
          maxLength={10}
        />

        <Button title="Save Changes" onPress={handleSave} loading={saving} style={styles.saveBtn} />
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
        <InfoRow label="Email" value={employee.email} last />
      </Card>

      <Button title="Sign Out" variant="outline" onPress={handleLogout} style={styles.logoutBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 12 },
  headerCard: { marginBottom: 20, paddingVertical: 18, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  headerInfo: { flex: 1 },
  name: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  position: { fontSize: 14, fontWeight: '500', marginTop: 4 },
  employeeId: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  avatarHint: { fontSize: 12, fontWeight: '500', marginTop: 14, textAlign: 'center' },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  editCard: { marginBottom: 20, padding: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '700', marginBottom: 8, marginTop: 4, letterSpacing: 0.8 },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  textArea: { minHeight: 84, textAlignVertical: 'top' },
  saveBtn: { marginTop: 8 },
  detailsCard: { marginBottom: 20 },
  logoutBtn: { marginTop: 4 },
});
