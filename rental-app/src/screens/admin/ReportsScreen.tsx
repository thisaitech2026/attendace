import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { reportTypes } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export function ReportsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <Text style={styles.subtitle}>Generate and view reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {reportTypes.map((report) => (
          <TouchableOpacity key={report.id} activeOpacity={0.7}>
            <Card style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: report.color + '18' }]}>
                <Ionicons name={report.icon as any} size={24} color={report.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDesc}>View and export report data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardContent: { flex: 1 },
  reportTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  reportDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
