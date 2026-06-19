import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { PaymentMethodCard } from '../../components/PaymentMethodCard';
import { Button } from '../../components/Button';
import { customerDashboard, paymentMethods, formatCurrency } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface PaymentScreenProps {
  navigation: any;
}

export function PaymentScreen({ navigation }: PaymentScreenProps) {
  const { outstandingAmount, fineAmount, totalPayable } = customerDashboard;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Payment Successful',
        `Payment of ${formatCurrency(totalPayable)} completed successfully!`,
        [{ text: 'View Receipt', onPress: () => navigation.navigate('Receipts') }]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Make Payment" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summary}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Outstanding Rent</Text>
            <Text style={styles.summaryValue}>{formatCurrency(outstandingAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Fine Amount</Text>
            <Text style={[styles.summaryValue, styles.fine]}>{formatCurrency(fineAmount)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalPayable)}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <View style={styles.methods}>
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              name={method.name}
              icon={method.icon as any}
              selected={selectedMethod === method.id}
              onPress={() => setSelectedMethod(method.id)}
            />
          ))}
        </View>

        <Card style={styles.secure}>
          <Text style={styles.secureText}>🔒 Secure payment gateway integration</Text>
          <Text style={styles.secureSub}>Your payment information is encrypted and secure</Text>
        </Card>

        <Button
          title={`Pay ${formatCurrency(totalPayable)}`}
          onPress={handlePay}
          loading={loading}
          size="lg"
          style={styles.payBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl * 2 },
  summary: { marginBottom: spacing.xl },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  summaryLabel: { fontSize: 14, color: colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: colors.text },
  fine: { color: colors.warning },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.sm, paddingTop: spacing.md },
  totalLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 20, fontWeight: '800', color: colors.primary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  methods: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.xl },
  secure: { backgroundColor: colors.successLight, marginBottom: spacing.xl },
  secureText: { fontSize: 14, fontWeight: '600', color: colors.success },
  secureSub: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  payBtn: { marginTop: spacing.md },
});
