import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { payments, formatCurrency } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface PaymentHistoryScreenProps {
  navigation: any;
}

export function PaymentHistoryScreen({ navigation }: PaymentHistoryScreenProps) {
  const customerPayments = payments.filter((p) => p.customerId === 'CUST-001');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Payment History" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.list}>
        {customerPayments.map((payment) => (
          <Card key={payment.id} style={styles.card}>
            <View style={styles.header}>
              <View>
                <Text style={styles.txnId}>{payment.transactionId}</Text>
                <Text style={styles.date}>{payment.paymentDate}</Text>
              </View>
              <Badge label={payment.status} variant={payment.status} />
            </View>

            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>Rent Month</Text>
                <Text style={styles.value}>{payment.rentMonth}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Rent Amount</Text>
                <Text style={styles.value}>{formatCurrency(payment.rentAmount)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Fine Amount</Text>
                <Text style={styles.value}>{formatCurrency(payment.fineAmount)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Paid</Text>
                <Text style={styles.totalPaid}>{formatCurrency(payment.totalPaid)}</Text>
              </View>
            </View>

            {payment.status === 'Success' && (
              <TouchableOpacity style={styles.receiptBtn} onPress={() => navigation.navigate('Receipts')}>
                <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                <Text style={styles.receiptText}>View Receipt</Text>
              </TouchableOpacity>
            )}
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  txnId: { fontSize: 14, fontWeight: '700', color: colors.text },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  details: { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  label: { fontSize: 13, color: colors.textSecondary },
  value: { fontSize: 13, fontWeight: '600', color: colors.text },
  totalPaid: { fontSize: 15, fontWeight: '700', color: colors.success },
  receiptBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.borderLight },
  receiptText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
