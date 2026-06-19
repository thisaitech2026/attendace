import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { customers, properties } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface RentalFormScreenProps {
  navigation: any;
}

export function RentalFormScreen({ navigation }: RentalFormScreenProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0].name);
  const [selectedProperty, setSelectedProperty] = useState(properties[0].name);
  const [rentStartDate, setRentStartDate] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [dueDate, setDueDate] = useState('5');
  const [gracePeriod, setGracePeriod] = useState('3');
  const [finePerDay, setFinePerDay] = useState('100');
  const [depositAmount, setDepositAmount] = useState('');

  const handleSave = () => {
    Alert.alert('Success', 'Rental mapping created successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Map Rental" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.hint}>Map a customer to a property with rental terms</Text>

        <Text style={styles.label}>Customer</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {customers.map((c) => (
            <Button
              key={c.id}
              title={c.name}
              variant={selectedCustomer === c.name ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setSelectedCustomer(c.name)}
              style={styles.chip}
            />
          ))}
        </ScrollView>

        <Text style={styles.label}>Property</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {properties.map((p) => (
            <Button
              key={p.id}
              title={p.name}
              variant={selectedProperty === p.name ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setSelectedProperty(p.name)}
              style={styles.chip}
            />
          ))}
        </ScrollView>

        <Input label="Rent Start Date" placeholder="YYYY-MM-DD" value={rentStartDate} onChangeText={setRentStartDate} />
        <Input label="Monthly Rent (₹)" placeholder="0" value={monthlyRent} onChangeText={setMonthlyRent} keyboardType="numeric" />
        <Input label="Due Date (day of month)" placeholder="5" value={dueDate} onChangeText={setDueDate} keyboardType="numeric" />
        <Input label="Grace Period (days)" placeholder="3" value={gracePeriod} onChangeText={setGracePeriod} keyboardType="numeric" />
        <Input label="Fine Per Day (₹)" placeholder="100" value={finePerDay} onChangeText={setFinePerDay} keyboardType="numeric" />
        <Input label="Deposit Amount (₹)" placeholder="0" value={depositAmount} onChangeText={setDepositAmount} keyboardType="numeric" />

        <View style={styles.formula}>
          <Text style={styles.formulaTitle}>Fine Formula</Text>
          <Text style={styles.formulaText}>Late Days × Fine Per Day</Text>
        </View>

        <Button title="Create Mapping" onPress={handleSave} size="lg" style={styles.saveBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  form: { padding: spacing.lg, paddingBottom: spacing.xxxl * 2 },
  hint: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xl },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  chipScroll: { marginBottom: spacing.lg },
  chip: { marginRight: spacing.sm },
  formula: { backgroundColor: colors.warningLight, padding: spacing.lg, borderRadius: 12, marginVertical: spacing.lg },
  formulaTitle: { fontSize: 13, fontWeight: '700', color: colors.warning },
  formulaText: { fontSize: 14, color: colors.text, marginTop: spacing.xs },
  saveBtn: { marginTop: spacing.md },
});
