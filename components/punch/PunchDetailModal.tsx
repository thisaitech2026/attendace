import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PunchDetailPanel } from '@/components/punch/PunchDetailPanel';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface PunchDetailModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PunchDetailModal({ visible, onClose }: PunchDetailModalProps) {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(15, 23, 42, 0.45)' }]}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close punch details backdrop" />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0),
            },
          ]}
        >
          <PunchDetailPanel onClose={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  sheet: {
    maxHeight: '92%',
    minHeight: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
});
