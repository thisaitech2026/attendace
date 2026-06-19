import React, { useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Customer } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CustomerFormScreenProps {
  navigation: any;
  route: any;
}

export function CustomerFormScreen({ navigation, route }: CustomerFormScreenProps) {
  const existing: Customer | undefined = route.params?.customer;
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? '');
  const [mobile, setMobile] = useState(existing?.mobile ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');
  const [address, setAddress] = useState(existing?.address ?? '');
  const [aadhaar, setAadhaar] = useState(existing?.aadhaar ?? '');
  const [occupation, setOccupation] = useState(existing?.occupation ?? '');
  const [emergencyContact, setEmergencyContact] = useState(existing?.emergencyContact ?? '');
  const [username, setUsername] = useState(existing?.username ?? '');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    Alert.alert('Success', `Customer ${isEdit ? 'updated' : 'created'} successfully!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={isEdit ? 'Edit Customer' : 'Add Customer'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.form}>
        <Input label="Customer Name" placeholder="Full name" value={name} onChangeText={setName} />
        <Input label="Mobile Number" placeholder="+91 XXXXX XXXXX" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
        <Input label="Email" placeholder="email@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Input label="Address" placeholder="Full address" value={address} onChangeText={setAddress} />
        <Input label="Aadhaar Number" placeholder="XXXX-XXXX-XXXX" value={aadhaar} onChangeText={setAadhaar} />
        <Input label="Occupation" placeholder="Occupation" value={occupation} onChangeText={setOccupation} />
        <Input label="Emergency Contact" placeholder="+91 XXXXX XXXXX" value={emergencyContact} onChangeText={setEmergencyContact} keyboardType="phone-pad" />
        <Input label="Username" placeholder="Login username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        {!isEdit && (
          <Input label="Password" placeholder="Login password" value={password} onChangeText={setPassword} secureTextEntry />
        )}
        <Button title={isEdit ? 'Update Customer' : 'Create Customer'} onPress={handleSave} size="lg" style={styles.saveBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  form: { padding: spacing.lg, paddingBottom: spacing.xxxl * 2 },
  saveBtn: { marginTop: spacing.xl },
});
