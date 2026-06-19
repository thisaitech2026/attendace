import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ListItem } from '../../components/ListItem';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface AdminMoreScreenProps {
  onLogout: () => void;
}

export function AdminMoreScreen({ onLogout }: AdminMoreScreenProps) {
  const navigation = useNavigation<any>();

  const menuItems = [
    { title: 'Utilities', subtitle: 'EB & Water management', icon: 'flash' as const, screen: 'Utilities', color: colors.warning },
    { title: 'Reports', subtitle: 'All report types', icon: 'bar-chart' as const, screen: 'Reports', color: colors.secondary },
    { title: 'Payments', subtitle: 'Payment history', icon: 'card' as const, screen: 'Payments', color: colors.success },
    { title: 'Overdue Accounts', subtitle: 'Due & fine tracking', icon: 'alert-circle' as const, screen: 'Overdue', color: colors.danger },
  ];

  const navigateTo = (screen: string) => {
    navigation.getParent()?.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Admin tools & settings</Text>
      </View>

      <ScrollView>
        <View style={styles.adminCard}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.adminName}>Administrator</Text>
            <Text style={styles.adminRole}>Full system access</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <ListItem
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              leftIcon={item.icon}
              leftIconColor={item.color}
              onPress={() => navigateTo(item.screen)}
            />
          ))}
        </View>

        <View style={styles.logoutWrap}>
          <Button title="Sign Out" variant="outline" onPress={onLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  adminCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, margin: spacing.lg, padding: spacing.lg, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  adminName: { fontSize: 18, fontWeight: '700', color: colors.text },
  adminRole: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  menu: { backgroundColor: colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  logoutWrap: { padding: spacing.lg, marginTop: spacing.xl, marginBottom: spacing.xxxl },
});
