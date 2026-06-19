import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { payments, formatCurrency } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface PaymentsScreenProps {
  navigation: any;
}

export function PaymentsScreen({ navigation }: PaymentsScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Payment History" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.list}>
        {payments.map((payment) => (
          <Card key={payment.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.txnId}>{payment.transactionId}</Text>
                <Text style={styles.date}>{payment.paymentDate}</Text>
              </View>
              <Badge label={payment.status} variant={payment.status} />
            </View>

            <View style={styles.details}>
              <View style={styles.row}>
                <Text style={styles.label}>Customer</Text>
                <Text style={styles.value}>{payment.customerName}</Text>
              </View>
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
                <Text style={[styles.value, payment.fineAmount > 0 && styles.fine]}>
                  {formatCurrency(payment.fineAmount)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Payment Method</Text>
                <Text style={styles.value}>{payment.method}</Text>
              </View>
            </View>

            <View style={styles.total}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>{formatCurrency(payment.totalPaid)}</Text>
            </View>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  txnId: { fontSize: 14, fontWeight: '700', color: colors.text },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  details: { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  label: { fontSize: 13, color: colors.textSecondary },
  value: { fontSize: 13, fontWeight: '600', color: colors.text },
  fine: { color: colors.danger },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: colors.success },
});
