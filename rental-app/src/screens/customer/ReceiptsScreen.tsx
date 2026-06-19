import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { payments, customerDashboard, formatCurrency } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ReceiptsScreenProps {
  navigation: any;
}

export function ReceiptsScreen({ navigation }: ReceiptsScreenProps) {
  const successfulPayments = payments.filter((p) => p.customerId === 'CUST-001' && p.status === 'Success');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Receipts" subtitle="Auto-generated PDF receipts" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.list}>
        {successfulPayments.map((payment) => (
          <Card key={payment.id} style={styles.card}>
            <View style={styles.receiptHeader}>
              <Ionicons name="document-text" size={32} color={colors.primary} />
              <View style={styles.receiptInfo}>
                <Text style={styles.receiptTitle}>Payment Receipt</Text>
                <Text style={styles.receiptId}>{payment.transactionId}</Text>
              </View>
            </View>

            <View style={styles.receiptBody}>
              <ReceiptRow label="Date" value={payment.paymentDate} />
              <ReceiptRow label="Rent Month" value={payment.rentMonth} />
              <ReceiptRow label="Customer" value={customerDashboard.customer.name} />
              <ReceiptRow label="Property" value={customerDashboard.property.name} />
              <ReceiptRow label="Rent" value={formatCurrency(payment.rentAmount)} />
              <ReceiptRow label="Fine" value={formatCurrency(payment.fineAmount)} />
              <ReceiptRow label="Total Paid" value={formatCurrency(payment.totalPaid)} highlight />
              <ReceiptRow label="Method" value={payment.method} />
            </View>

            <View style={styles.actions}>
              <Button title="View" variant="outline" size="sm" onPress={() => {}} style={styles.actionBtn} />
              <Button title="Download PDF" size="sm" onPress={() => {}} style={styles.actionBtn} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function ReceiptRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.highlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.lg },
  receiptHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  receiptInfo: { flex: 1 },
  receiptTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  receiptId: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  receiptBody: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { fontSize: 13, color: colors.textSecondary },
  rowValue: { fontSize: 13, fontWeight: '600', color: colors.text },
  highlight: { fontSize: 16, fontWeight: '800', color: colors.success },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  actionBtn: { flex: 1 },
});
