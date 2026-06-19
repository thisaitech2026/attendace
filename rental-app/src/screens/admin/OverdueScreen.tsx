import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/ScreenHeader';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { overdueAccounts, formatCurrency } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface OverdueScreenProps {
  navigation: any;
}

export function OverdueScreen({ navigation }: OverdueScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Overdue Accounts" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.list}>
        {overdueAccounts.map((account, index) => (
          <Card key={index} style={styles.card}>
            <View style={styles.header}>
              <View>
                <Text style={styles.name}>{account.customerName}</Text>
                <Text style={styles.property}>{account.property}</Text>
              </View>
              <Badge label={`${account.daysOverdue} days`} variant="Failed" />
            </View>

            <View style={styles.amounts}>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Due Amount</Text>
                <Text style={styles.dueAmount}>{formatCurrency(account.dueAmount)}</Text>
              </View>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Fine</Text>
                <Text style={styles.fineAmount}>{formatCurrency(account.fine)}</Text>
              </View>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Total</Text>
                <Text style={styles.totalAmount}>{formatCurrency(account.dueAmount + account.fine)}</Text>
              </View>
            </View>

            <Text style={styles.formula}>
              Fine = {account.daysOverdue} days × fine per day
            </Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  property: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  amounts: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  amountItem: { flex: 1, backgroundColor: colors.surfaceAlt, padding: spacing.md, borderRadius: 12 },
  amountLabel: { fontSize: 11, color: colors.textMuted },
  dueAmount: { fontSize: 16, fontWeight: '700', color: colors.danger, marginTop: 4 },
  fineAmount: { fontSize: 16, fontWeight: '700', color: colors.warning, marginTop: 4 },
  totalAmount: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 },
  formula: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic' },
});
