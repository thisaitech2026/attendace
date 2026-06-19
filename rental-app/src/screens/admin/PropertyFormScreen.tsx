import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Property, PropertyType } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const propertyTypes: PropertyType[] = ['House', 'Apartment', 'Villa', 'Shop', 'Commercial Unit'];

interface PropertyFormScreenProps {
  navigation: any;
  route: any;
}

export function PropertyFormScreen({ navigation, route }: PropertyFormScreenProps) {
  const existing: Property | undefined = route.params?.property;
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? '');
  const [address, setAddress] = useState(existing?.address ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [type, setType] = useState<PropertyType>(existing?.type ?? 'House');
  const [monthlyRent, setMonthlyRent] = useState(existing?.monthlyRent?.toString() ?? '');
  const [securityDeposit, setSecurityDeposit] = useState(existing?.securityDeposit?.toString() ?? '');
  const [ebNumber, setEbNumber] = useState(existing?.ebServiceNumber ?? '');
  const [ebConsumer, setEbConsumer] = useState(existing?.ebConsumerName ?? '');
  const [waterNumber, setWaterNumber] = useState(existing?.waterConnectionNumber ?? '');
  const [waterConsumer, setWaterConsumer] = useState(existing?.waterConsumerName ?? '');

  const handleSave = () => {
    Alert.alert('Success', `Property ${isEdit ? 'updated' : 'added'} successfully!`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader
        title={isEdit ? 'Edit Property' : 'Add Property'}
        onBack={() => navigation.goBack()}
      />
      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
        <Text style={styles.section}>Basic Information</Text>
        <Input label="Property Name" placeholder="Enter property name" value={name} onChangeText={setName} />
        <Input label="Address" placeholder="Enter full address" value={address} onChangeText={setAddress} />
        <Input label="Description" placeholder="Property description" value={description} onChangeText={setDescription} multiline />

        <Text style={styles.label}>Property Type</Text>
        <View style={styles.typeGrid}>
          {propertyTypes.map((t) => (
            <Button
              key={t}
              title={t}
              variant={type === t ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setType(t)}
              style={styles.typeBtn}
            />
          ))}
        </View>

        <Input label="Monthly Rent (₹)" placeholder="0" value={monthlyRent} onChangeText={setMonthlyRent} keyboardType="numeric" />
        <Input label="Security Deposit (₹)" placeholder="0" value={securityDeposit} onChangeText={setSecurityDeposit} keyboardType="numeric" />

        <Text style={styles.section}>Utility Information</Text>
        <Input label="EB Service Number" placeholder="EB-XXXXXXXX" value={ebNumber} onChangeText={setEbNumber} />
        <Input label="EB Consumer Name" placeholder="Consumer name" value={ebConsumer} onChangeText={setEbConsumer} />
        <Input label="Water Connection Number" placeholder="WC-XXXXXXXX" value={waterNumber} onChangeText={setWaterNumber} />
        <Input label="Water Consumer Name" placeholder="Consumer name" value={waterConsumer} onChangeText={setWaterConsumer} />

        <Button title={isEdit ? 'Update Property' : 'Add Property'} onPress={handleSave} size="lg" style={styles.saveBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  form: { flex: 1 },
  formContent: { padding: spacing.lg, paddingBottom: spacing.xxxl * 2 },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md, marginTop: spacing.lg },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  typeBtn: { marginBottom: spacing.xs },
  saveBtn: { marginTop: spacing.xl },
});
